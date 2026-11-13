import { describe, expect, it } from "vitest";
import { searchQuerySchema } from "./search.schema.js";

describe("searchQuerySchema", () => {
  it("applies defaults when nothing is provided", () => {
    expect(searchQuerySchema.parse({})).toEqual({ sort: "relevance", page: 1 });
  });

  it("treats empty strings as not provided", () => {
    const r = searchQuerySchema.parse({
      q: "",
      category: "  ",
      brand: "",
      minPrice: "",
      sort: "",
      page: "",
    });
    expect(r).toEqual({ sort: "relevance", page: 1 });
  });

  it("coerces numeric strings and trims text", () => {
    const r = searchQuerySchema.parse({ q: "  hello ", minPrice: "5.5", page: "3" });
    expect(r).toMatchObject({ q: "hello", minPrice: 5.5, page: 3 });
  });

  it("parses maxPrice and treats empty as not provided", () => {
    expect(searchQuerySchema.parse({ maxPrice: "20" }).maxPrice).toBe(20);
    expect(searchQuerySchema.parse({ maxPrice: "" }).maxPrice).toBeUndefined();
  });

  it("rejects a minPrice greater than maxPrice", () => {
    expect(searchQuerySchema.safeParse({ minPrice: "20", maxPrice: "5" }).success).toBe(false);
    expect(searchQuerySchema.safeParse({ minPrice: "5", maxPrice: "5" }).success).toBe(true);
  });

  it("accepts minPrice of 0", () => {
    expect(searchQuerySchema.parse({ minPrice: "0" }).minPrice).toBe(0);
  });

  it.each([
    [{ minPrice: "-1" }],
    [{ minPrice: "abc" }],
    [{ minPrice: "Infinity" }],
    [{ page: "0" }],
    [{ page: "1.5" }],
    [{ page: "1001" }],
    [{ sort: "random" }],
    [{ q: "x".repeat(101) }],
    [{ category: "x".repeat(51) }],
    [{ q: ["a", "b"] }],
    [{ unknown: "1" }],
  ])("rejects %j", (input) => {
    expect(searchQuerySchema.safeParse(input).success).toBe(false);
  });

  it("accepts boundary values", () => {
    expect(searchQuerySchema.safeParse({ q: "x".repeat(100), page: "1000" }).success).toBe(true);
  });
});
