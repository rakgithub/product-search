import type { Request, Response } from "express";
import type { SearchQuery } from "../schemas/search.schema.js";
import { searchProducts, type SearchResult } from "../services/search.service.js";

export function search(_req: Request, res: Response<SearchResult, { query: SearchQuery }>) {
  res.json(searchProducts(res.locals.query));
}
