export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface SearchResponse {
  items: Product[];
  pagination: Pagination;
}

/** Filter form values. Kept as strings because they come straight from inputs; empty = not set. */
export interface ProductFilters {
  q: string;
  category: string;
  brand: string;
  minPrice: string;
  maxPrice: string;
}

export const EMPTY_FILTERS: ProductFilters = {
  q: "",
  category: "",
  brand: "",
  minPrice: "",
  maxPrice: "",
};
