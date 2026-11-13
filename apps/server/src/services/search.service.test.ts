import { describe, expect, it } from "vitest";
import type { Product } from "../types/product.js";
import type { SearchQuery } from "../schemas/search.schema.js";
import { searchProducts } from "./search.service.js";

const make = (id: string, over: Partial<Product> = {}): Product => ({
  id,
  name: `Product ${id}`,
  description: "generic",
  category: "cat-a",
  brand: "Brand A",
  price: 10,
  ...over,
});

const base: SearchQuery = { sort: "relevance", page: 1 };
const ids = (r: { items: Product[] }) => r.items.map((p) => p.id);

describe("searchProducts", () => {
  describe("filters", () => {
    const data = [
      make("1", { category: "cat-a", brand: "Acme", price: 5 }),
      make("2", { category: "cat-b", brand: "Acme", price: 15 }),
      make("3", { category: "cat-a", brand: "Zeta", price: 25 }),
    ];

    it("filters by category case-insensitively", () => {
      expect(ids(searchProducts({ ...base, category: "CAT-A" }, data))).toEqual(["1", "3"]);
    });

    it("filters by brand case-insensitively", () => {
      expect(ids(searchProducts({ ...base, brand: "acme" }, data))).toEqual(["1", "2"]);
    });

    it("treats minPrice as inclusive", () => {
      expect(ids(searchProducts({ ...base, minPrice: 15 }, data))).toEqual(["2", "3"]);
    });

    it("treats maxPrice as inclusive", () => {
      expect(ids(searchProducts({ ...base, maxPrice: 15 }, data))).toEqual(["1", "2"]);
    });

    it("combines minPrice and maxPrice into a range", () => {
      expect(ids(searchProducts({ ...base, minPrice: 10, maxPrice: 20 }, data))).toEqual(["2"]);
    });

    it("accepts minPrice of 0", () => {
      expect(searchProducts({ ...base, minPrice: 0 }, data).pagination.total).toBe(3);
    });

    it("combines filters with AND", () => {
      expect(
        ids(searchProducts({ ...base, category: "cat-a", brand: "acme", minPrice: 1 }, data)),
      ).toEqual(["1"]);
    });
  });

  describe("text search and relevance", () => {
    const data = [
      make("desc", { name: "Plain", description: "contains aspirin here" }),
      make("name", { name: "Aspirin 100", description: "tablets" }),
      make("brand", { name: "Other", brand: "Aspirin Co" }),
    ];

    it("ranks name matches above brand/description matches", () => {
      expect(ids(searchProducts({ ...base, q: "aspirin" }, data))[0]).toBe("name");
    });

    it("keeps catalogue order for equal scores", () => {
      expect(ids(searchProducts({ ...base, q: "aspirin" }, data))).toEqual([
        "name",
        "desc",
        "brand",
      ]);
    });

    it("is case-insensitive", () => {
      expect(searchProducts({ ...base, q: "ASPIRIN" }, data).pagination.total).toBe(3);
    });

    it("requires every term to match somewhere", () => {
      const r = searchProducts({ ...base, q: "aspirin tablets" }, data);
      expect(ids(r)).toEqual(["name"]);
    });

    it("returns nothing when no product matches", () => {
      expect(searchProducts({ ...base, q: "nonexistent" }, data).items).toEqual([]);
    });

    it("ignores extra whitespace between terms", () => {
      expect(searchProducts({ ...base, q: "aspirin   tablets" }, data).pagination.total).toBe(1);
    });
  });

  describe("sorting", () => {
    const data = [
      make("1", { name: "Banana", price: 20 }),
      make("2", { name: "apple", price: 10 }),
      make("3", { name: "Cherry", price: 30 }),
    ];

    it.each([
      ["price_asc", ["2", "1", "3"]],
      ["price_desc", ["3", "1", "2"]],
      ["name_asc", ["2", "1", "3"]],
      ["name_desc", ["3", "1", "2"]],
    ] as const)("sorts by %s", (sort, expected) => {
      expect(ids(searchProducts({ ...base, sort }, data))).toEqual(expected);
    });

    it("applies sort after filtering", () => {
      expect(ids(searchProducts({ ...base, sort: "price_desc", minPrice: 15 }, data))).toEqual([
        "3",
        "1",
      ]);
    });
  });

  describe("pagination", () => {
    const data = Array.from({ length: 25 }, (_, i) => make(String(i + 1)));

    it("returns 10 items per page and correct metadata", () => {
      const r = searchProducts({ ...base, page: 1 }, data);
      expect(r.items).toHaveLength(10);
      expect(r.pagination).toEqual({ page: 1, pageSize: 10, total: 25, totalPages: 3 });
    });

    it("returns the remainder on the last page", () => {
      expect(ids(searchProducts({ ...base, page: 3 }, data))).toEqual([
        "21",
        "22",
        "23",
        "24",
        "25",
      ]);
    });

    it("returns empty items for a page past the end, keeping totals", () => {
      const r = searchProducts({ ...base, page: 4 }, data);
      expect(r.items).toEqual([]);
      expect(r.pagination.total).toBe(25);
    });

    it("reports zero pages when there are no results", () => {
      expect(searchProducts({ ...base, q: "zzz" }, data).pagination).toEqual({
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
      });
    });
  });
});
