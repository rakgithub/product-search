import type { ProductFilters } from "../types";

/** Builds the /search query string, leaving out empty filters. */
export function buildSearchParams(filters: ProductFilters, page = 1): URLSearchParams {
  const params = new URLSearchParams();
  (Object.entries(filters) as [keyof ProductFilters, string][]).forEach(([key, value]) => {
    const trimmed = value.trim();
    if (trimmed) params.set(key, trimmed);
  });
  if (page > 1) params.set("page", String(page));
  return params;
}
