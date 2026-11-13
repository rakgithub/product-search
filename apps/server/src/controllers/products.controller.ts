import type { Request, Response } from "express";
import { listProducts, type ProductList } from "../services/products.service.js";

export function list(_req: Request, res: Response<ProductList>) {
  res.json(listProducts());
}
