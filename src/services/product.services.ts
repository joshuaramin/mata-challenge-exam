import {
  CreateProductData,
  ProductArgs,
} from "@/lib/interface/product.interface";
import { prisma } from "@/lib/prisma";
import { Product, Prisma } from "@/lib/prisma/generated/client";
import ResultFn from "@/lib/pagination/cursorPagination";

export const GetProducts = async ({
  filter: { orderBy, sortBy, search },
  first,
  after,
}: ProductArgs) => {
  let where: Prisma.ProductWhereInput = {
    is_deleted: false,
    ...(search && {
      name: { contains: search, mode: "insensitive" },
    }),
  };

  const result = await prisma.product.findMany({
    where,
    orderBy: { [orderBy]: sortBy },
    take: first + 1,
    ...(after && { skip: 1, cursor: { product_id: after } }),
  });
  const hasNextPage = result.length > first;
  const slicedResult = result.slice(0, first);
  return ResultFn<Product, string>({
    edges: slicedResult.map((result) => ({
      node: result,
      cursor: result.product_id,
    })),
    pageInfo: {
      hasNextPage,
      endCursor: slicedResult.length
        ? slicedResult[slicedResult.length - 1].product_id
        : "",
    },
    totalCount: await prisma.product.count({ where }),
  });
};

export const CreateProduct = async (data: CreateProductData) => {
  return await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      quantity: data.quantity,
    },
  });
};

export const GetProductById = async (product_id: string) => {
  return await prisma.product.findFirst({
    where: { product_id, is_deleted: false },
  });
};

export const UpdateProductDetails = async (
  product_id: string,
  data: CreateProductData,
) => {
  if (data.quantity) {
    return await prisma.product.update({
      where: { product_id },
      data: { quantity: data.quantity },
    });
  } else {
    return await prisma.product.update({
      where: {
        product_id,
      },
      data: {
        description: data.description,
        price: data.price,
        name: data.name,
      },
    });
  }
};
export const SoftDeleteProduct = async (product_id: string) => {
  return await prisma.product.update({
    where: { product_id },
    data: { is_deleted: true },
  });
};
