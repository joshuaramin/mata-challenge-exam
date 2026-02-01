import { Context } from "koa";

//services
import {
  CreateProduct,
  GetProductById,
  GetProducts,
  SoftDeleteProduct,
  UpdateProductDetails,
} from "@/services/product.services";
import { CreateProductData } from "@/lib/interface/product.interface";
import { ProductSchema } from "@/lib/validation/product.validation";

export const getAllProducts = async (ctx: Context) => {
  try {
    const { orderBy, sortBy, search, first = 10, after } = ctx.request.query;
    const result = await GetProducts({
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
      error: "Failed to retrieve products",
      debug: process.env.NODE_ENV !== "production" ? String(error) : undefined,
    };
  }
};

export const createProduct = async (ctx: Context) => {
  const body = ctx.request.body as CreateProductData;

  const parsedData = ProductSchema.safeParse(body);
  if (!parsedData.success) {
    ctx.status = 400;
    ctx.body = {
      error: "Invalid product data",
      message: parsedData.error.issues,
    };
    return;
  }

  const { name, description, price, quantity } = parsedData.data;

  try {
    const newProduct = await CreateProduct({
      name,
      description,
      price,
      quantity,
    });
    ctx.status = 201;
    ctx.body = {
      success: true,
      data: newProduct,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      error: "Failed to create product",
      debug: process.env.NODE_ENV !== "production" ? String(error) : undefined,
    };
  }
};

export const getProductById = async (ctx: Context) => {
  const productId = ctx.params.id;
  try {
    const product = await GetProductById(productId);
    if (!product) {
      ctx.status = 404;
      ctx.body = {
        error: "Product not found",
      };
      return;
    }
    ctx.status = 200;
    ctx.body = {
      success: true,
      data: product,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      error: "Failed to retrieve product",
    };
  }
};

export const updateProductDetails = async (ctx: Context) => {
  const productId = ctx.params.id;
  const body = ctx.request.body as CreateProductData;
  try {
    const result = await UpdateProductDetails(productId, body);

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: result,
    };
  } catch (error) {
    ctx.status = 400;
    ctx.body = {
      error: "Failed to update product details",
      debug: process.env.NODE_ENV !== "production" ? String(error) : undefined,
    };
  }
};

export const softDeleteProduct = async (ctx: Context) => {
  const productId = ctx.params.id;
  try {
    const deletedProduct = await SoftDeleteProduct(productId);
    ctx.status = 200;
    ctx.body = {
      success: true,
      data: deletedProduct,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      error: "Failed to delete product",
      debug: process.env.NODE_ENV !== "production" ? String(error) : undefined,
    };
  }
};
