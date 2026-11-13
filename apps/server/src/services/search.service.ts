import { products as catalogue } from "../data/products.js";
import type { Product } from "../types/product.js";
import { PAGE_SIZE, type SearchQuery, type SortOption } from "../schemas/search.schema.js";

export interface SearchResult {
  items: Product[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

const eq = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

/** Name matches weigh more than brand/description matches. 0 = no match. */
function relevance(product: Product, terms: string[]): number {
  const name = product.name.toLowerCase();
  const rest = `${product.brand} ${product.description}`.toLowerCase();
  let score = 0;
  for (const term of terms) {
    if (name.includes(term)) score += 2;
    else if (rest.includes(term)) score += 1;
    else return 0; // every term must match somewhere
  }
  return score;
}

const comparators: Record<Exclude<SortOption, "relevance">, (a: Product, b: Product) => number> = {
  price_asc: (a, b) => a.price - b.price,
  price_desc: (a, b) => b.price - a.price,
  name_asc: (a, b) => a.name.localeCompare(b.name),
  name_desc: (a, b) => b.name.localeCompare(a.name),
};

export function searchProducts(query: SearchQuery, source: Product[] = catalogue): SearchResult {
  const { q, category, brand, minPrice, maxPrice, sort, page } = query;
  const terms = q ? q.toLowerCase().split(/\s+/).filter(Boolean) : [];

  let scored = source
    .filter((p) => !category || eq(p.category, category))
    .filter((p) => !brand || eq(p.brand, brand))
    .filter((p) => minPrice === undefined || p.price >= minPrice)
    .filter((p) => maxPrice === undefined || p.price <= maxPrice)
    .map((p) => ({ product: p, score: terms.length ? relevance(p, terms) : 0 }))
    .filter(({ score }) => !terms.length || score > 0);

  scored =
    sort === "relevance"
      ? scored.sort((a, b) => b.score - a.score) // stable: ties keep catalogue order
      : scored.sort((a, b) => comparators[sort](a.product, b.product));

  const total = scored.length;
  const start = (page - 1) * PAGE_SIZE;

  return {
    items: scored.slice(start, start + PAGE_SIZE).map(({ product }) => product),
    pagination: { page, pageSize: PAGE_SIZE, total, totalPages: Math.ceil(total / PAGE_SIZE) },
  };
}
