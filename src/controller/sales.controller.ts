import { Context } from "koa";
import { CreateSale, GetSalesByMonth } from "../services/sales.services.js";
import { CreateSaleInput } from "@/lib/interface/sale.interface.js";
import {
  CreateSaleSchema,
  GetSalesQuerySchema,
} from "@/lib/validation/sales.validation.js";

export const getSales = async (ctx: Context) => {
  try {
    const parsed = GetSalesQuerySchema.safeParse(ctx.request.query);

    if (!parsed.success) {
      ctx.status = 400;
      ctx.body = {
        error: "Invalid query parameters",
        message: parsed.error.issues,
      };
      return;
    }

    const result = await GetSalesByMonth({ month: parsed.data.month });

    ctx.status = 200;
    ctx.body = { success: true, data: result };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      error: "Failed to fetch sales",
      debug: process.env.NODE_ENV !== "production",
    };
  }
};

export const createSale = async (ctx: Context) => {
  try {
    const body = ctx.request.body as CreateSaleInput;

    const parsedData = CreateSaleSchema.safeParse(body);
    if (!parsedData.success) {
      ctx.status = 400;
      ctx.body = {
        error: "Invalid product data",
        message: parsedData.error.issues,
      };
      return;
    }

    const sale = await CreateSale(parsedData.data);

    ctx.status = 201;
    ctx.body = {
      success: true,
      data: sale,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      error: "Failed to create a sale product",
      debug: process.env.NODE_ENV !== "production" ? String(error) : undefined,
    };
  }
};
