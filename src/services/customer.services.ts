import bcrypt from "bcrypt";

//lib
import { CustomerArgs } from "@/lib/interface/customer.interface";
import { prisma } from "@/lib/prisma";
import { Customer, Prisma } from "@/lib/prisma/generated/client";
import { CreateCustomerData } from "@/lib/interface/customer.interface";
import ResultFn from "@/lib/pagination/cursorPagination";

export const GetCustomers = async ({
  filter: { orderBy, sortBy, search },
  first,
  after,
}: CustomerArgs) => {
  let where: Prisma.CustomerWhereInput = {
    is_deleted: false,
    ...(search && {
      OR: [
        {
          email: { contains: search, mode: "insensitive" },
        },
        {
          Profile: {
            OR: [
              { first_name: { contains: search, mode: "insensitive" } },
              { last_name: { contains: search, mode: "insensitive" } },
            ],
          },
        },
      ],
    }),
  };
  const result = await prisma.customer.findMany({
    where,
    orderBy: { [orderBy]: sortBy },
    take: first + 1,
    ...(after && { skip: 1, cursor: { customer_id: after } }),
  });

  const hasNextPage = result.length > first;
  const slicedResult = result.slice(0, first);

  return ResultFn<Customer, string>({
    edges: slicedResult.map((result) => ({
      node: result,
      cursor: result.customer_id,
    })),
    pageInfo: {
      hasNextPage,
      endCursor: slicedResult.length
        ? slicedResult[slicedResult.length - 1].customer_id
        : "",
    },
    totalCount: await prisma.customer.count({ where }),
  });
};

export const UpdateCustomerDetails = async (
  customer_id: string,
  data: CreateCustomerData,
) => {
  if (data.password) {
    const pass = await bcrypt.hash(data.password, 12);
    return await prisma.customer.update({
      data: {
        password: pass,
      },
      where: { customer_id },
    });
  } else {
    return await prisma.customer.update({
      data: {
        email: data.email,
        Profile: {
          update: { first_name: data.first_name, last_name: data.last_name },
        },
      },
      where: { customer_id },
    });
  }
};

export const GetCustomerById = async (customer_id: string) => {
  return await prisma.customer.findFirst({
    where: { customer_id, is_deleted: false },
    include: { Profile: true },
  });
};

export const SoftDeleteCustomer = async (customer_id: string) => {
  return await prisma.customer.update({
    where: { customer_id },
    data: { is_deleted: true },
  });
};
