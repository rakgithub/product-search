import { useCallback, useEffect, useState } from "react";
import { searchProducts } from "../api/searchProducts";
import { EMPTY_FILTERS, type Pagination, type Product, type ProductFilters } from "../types";

type Status = "loading" | "error" | "success";

interface Query {
  filters: ProductFilters;
  page: number;
}

/**
 * Calls the search API on mount and whenever `search` / `goToPage` is called.
 * Editing the filter form does not trigger a request - only an explicit search does.
 */
export function useProductSearch() {
  const [query, setQuery] = useState<Query>({ filters: EMPTY_FILTERS, page: 1 });
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const controller = new AbortController();
    // Intentional: reset to loading when a new query starts, before the fetch below.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus("loading");
    searchProducts(query.filters, query.page, controller.signal)
      .then((data) => {
        setProducts(data.items);
        setPagination(data.pagination);
        setStatus("success");
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setStatus("error");
      });
    return () => controller.abort();
  }, [query]);

  // A new object each call, so searching again with the same filters re-fetches.
  const search = useCallback((filters: ProductFilters) => setQuery({ filters, page: 1 }), []);
  const goToPage = useCallback((page: number) => setQuery((q) => ({ ...q, page })), []);

  return { products, pagination, status, search, goToPage };
}
