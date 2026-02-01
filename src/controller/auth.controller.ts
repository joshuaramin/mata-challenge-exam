import { LoginInput } from "@/lib/interface/auth.interface";
import { CreateCustomerData } from "@/lib/interface/customer.interface";
import { prisma } from "@/lib/prisma";
import {
  CreateCustomerSchema,
  UserSchema,
} from "@/lib/validation/customer.validation";
import { PostLogin, RegisterCustomer } from "@/services/auth.services";
import { Context } from "koa";

export const login = async (ctx: Context) => {
  try {
    const body = ctx.request.body as LoginInput;

    const parsedData = UserSchema.safeParse(body);

    if (!parsedData.success) {
      ctx.status = 400;
      ctx.body = {
        error: "Invalid login data",
        message: parsedData.error.issues,
      };

      return;
    }

    const result = await PostLogin({
      email: parsedData.data.email,
      password: parsedData.data.password,
    });

    ctx.status = 200;
    ctx.body = { success: true, data: result };
  } catch (error) {
    ctx.status = 401;
    ctx.body = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to login",
    };
  }
};

export const register = async (ctx: Context) => {
  const body = ctx.request.body as CreateCustomerData;

  const parsedData = CreateCustomerSchema.safeParse(body);

  if (!parsedData.success) {
    ctx.status = 400;
    ctx.body = {
      error: "Invalid customer data",
      message: parsedData.error.issues,
    };
    return;
  }

  const { email, password, first_name, last_name } = parsedData.data;

  const user = await prisma.customer.findUnique({
    where: { email },
  });

  if (user) {
    ctx.status = 409;
    ctx.body = {
      error: "Email address is already taken",
      debug:
        process.env.NODE_ENV !== "production"
          ? "Email Address is already exist"
          : undefined,
    };

    return;
  }

  try {
    const result = await RegisterCustomer({
      email,
      password,
      first_name,
      last_name,
    });
    ctx.status = 201;
    ctx.body = {
      success: true,
      data: result,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      error: "Failed to create customer",
      debug: process.env.NODE_ENV !== "production" ? String(error) : undefined,
    };
  }
};
