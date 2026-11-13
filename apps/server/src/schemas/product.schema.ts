import { z } from "zod";
import "../openapi/extend.js";

export const productSchema = z
  .object({
    id: z.string().openapi({ example: "1" }),
    name: z.string().openapi({ example: "Ibuprofen 400mg" }),
    description: z.string().openapi({ example: "Pain relief tablets for headaches and fever" }),
    category: z.string().openapi({ example: "pain-relief" }),
    brand: z.string().openapi({ example: "Nurofen" }),
    price: z.number().openapi({ example: 6.49 }),
  })
  .openapi("Product");

export const productListResponseSchema = z
  .object({
    items: z.array(productSchema),
    total: z.number().int().openapi({ example: 12 }),
  })
  .openapi("ProductListResponse");
