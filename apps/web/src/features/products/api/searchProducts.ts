import { apiGet } from "../../../lib/apiClient";
import type { ProductFilters, SearchResponse } from "../types";
import { buildSearchParams } from "../utils/buildSearchParams";

export function searchProducts(
  filters: ProductFilters,
  page = 1,
  signal?: AbortSignal,
): Promise<SearchResponse> {
  const query = buildSearchParams(filters, page).toString();
  return apiGet<SearchResponse>(`/search${query ? `?${query}` : ""}`, { signal });
}
