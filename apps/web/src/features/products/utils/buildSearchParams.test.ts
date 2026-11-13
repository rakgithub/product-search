import { describe, expect, it } from "vitest";
import { EMPTY_FILTERS } from "../types";
import { buildSearchParams } from "./buildSearchParams";

describe("buildSearchParams", () => {
  it("returns no params for empty filters", () => {
    expect(buildSearchParams(EMPTY_FILTERS).toString()).toBe("");
  });

  it("includes only the filters that are set", () => {
    const params = buildSearchParams({ ...EMPTY_FILTERS, q: "ibuprofen", maxPrice: "10" });
    expect(Object.fromEntries(params)).toEqual({ q: "ibuprofen", maxPrice: "10" });
  });

  it("trims values and drops whitespace-only ones", () => {
    const params = buildSearchParams({ ...EMPTY_FILTERS, q: "  cream ", brand: "   " });
    expect(Object.fromEntries(params)).toEqual({ q: "cream" });
  });

  it("maps every filter to the API parameter names", () => {
    const params = buildSearchParams({
      q: "x",
      category: "vitamins",
      brand: "Abtei",
      minPrice: "1",
      maxPrice: "9",
    });
    expect(Object.fromEntries(params)).toEqual({
      q: "x",
      category: "vitamins",
      brand: "Abtei",
      minPrice: "1",
      maxPrice: "9",
    });
  });

  it("adds page only when it is greater than 1", () => {
    expect(buildSearchParams(EMPTY_FILTERS, 1).has("page")).toBe(false);
    expect(buildSearchParams(EMPTY_FILTERS, 2).get("page")).toBe("2");
  });
});
