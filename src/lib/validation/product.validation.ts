import z from "zod";

export const ProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  quantity: z.number().min(0, "Quantity cannot be negative"),
  description: z.string().optional(),
  price: z.number().min(0, "Price cannot be negative"),
});
