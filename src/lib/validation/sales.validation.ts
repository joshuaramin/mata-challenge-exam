import z from "zod";

export const SalesItemSchme = z.object({
  product_id: z.string().min(1, "Product ID is required"),
  quantity: z.number().min(1, "Quantity must be at least 1").positive(),
});

export const CreateSaleSchema = z.object({
  customer_id: z.string().min(1, "Customer ID is required"),
  items: z.array(SalesItemSchme).min(1, "At least one sale item is required"),
});

export const GetSalesQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, "Month must be in YYYY-MM format"),
});
