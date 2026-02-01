import { Context } from "koa";

//lib
import { CreateCustomerData } from "@/lib/interface/customer.interface";
import { CreateCustomerSchema } from "@/lib/validation/customer.validation";

//services
import {
  GetCustomers,
  GetCustomerById,
  SoftDeleteCustomer,
  UpdateCustomerDetails,
} from "@/services/customer.services";

export const getAllCustomer = async (ctx: Context) => {
  try {
    const { orderBy, sortBy, search, first = 10, after } = ctx.request.query;

    const result = await GetCustomers({
      filter: {
        orderBy: orderBy as string,
        sortBy: sortBy as "asc" | "desc",
        search: search as string,
      },
      first: Number(first),
      after: after as string,
    });

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: result,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      error: "Failed to retrieve customers",
      debug: process.env.NODE_ENV !== "production" ? String(error) : undefined,
    };
  }
};

export const getCustomerById = async (ctx: Context) => {
  const customerId = ctx.params.id;
  try {
    const customer = await GetCustomerById(customerId);
    if (!customer) {
      ctx.status = 404;
      ctx.body = { error: "Customer not found" };
      return;
    }
    ctx.status = 200;
    ctx.body = {
      success: true,
      data: customer,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      error: "Failed to retrieve customer",
      debug: process.env.NODE_ENV !== "production" ? String(error) : undefined,
    };
  }
};

export const updateCustomerDetails = async (ctx: Context) => {
  const customerId = ctx.params.id;
  const body = ctx.request.body as CreateCustomerData;
  try {
    const result = await UpdateCustomerDetails(customerId, body);
    ctx.status = 200;
    ctx.body = {
      success: true,
      data: result,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      error: "Failed to update customer details",
      debug: process.env.NODE_ENV !== "production" ? String(error) : undefined,
    };
  }
};

export const softDeleteCustomer = async (ctx: Context) => {
  const customerId = ctx.params.id;
  try {
    const result = await SoftDeleteCustomer(customerId);
    ctx.status = 200;
    ctx.body = {
      success: true,
      data: result,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      error: "Failed to delete customer",
      debug: process.env.NODE_ENV !== "production" ? String(error) : undefined,
    };
  }
};
