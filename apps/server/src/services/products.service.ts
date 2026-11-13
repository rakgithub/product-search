import { products as catalogue } from "../data/products.js";
import type { Product } from "../types/product.js";

export interface ProductList {
  items: Product[];
  total: number;
}

export function listProducts(source: Product[] = catalogue): ProductList {
  return { items: source, total: source.length };
}
