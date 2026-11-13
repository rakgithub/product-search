import { describe, expect, it } from "vitest";
import type { Product } from "../types/product.js";
import { listProducts } from "./products.service.js";

const p = (id: string): Product => ({
  id, name: `P${id}`, description: "d", category: "c", brand: "b", price: 1,
});

describe("listProducts", () => {
  it("returns every product with a total", () => {
    const data = [p("1"), p("2"), p("3")];
    expect(listProducts(data)).toEqual({ items: data, total: 3 });
  });

  it("returns an empty list for an empty source", () => {
    expect(listProducts([])).toEqual({ items: [], total: 0 });
  });
});
