import { describe, expect, it } from "vitest";
import type { Pagination } from "../types";
import { formatResultRange } from "./formatResultRange";

const pagination = (overrides: Partial<Pagination>): Pagination => ({
  page: 1,
  pageSize: 10,
  total: 12,
  totalPages: 2,
  ...overrides,
});

describe("formatResultRange", () => {
  it("formats the first page with an en dash", () => {
    expect(formatResultRange(pagination({ page: 1 }))).toBe("Showing 1–10 of 12 results");
  });

  it("clamps the end of the range on the last page", () => {
    expect(formatResultRange(pagination({ page: 2 }))).toBe("Showing 11–12 of 12 results");
  });

  it("uses the singular and no range for a single result", () => {
    expect(formatResultRange(pagination({ total: 1, totalPages: 1 }))).toBe(
      "Showing 1 of 1 result",
    );
  });

  it("returns an empty string when there are no results", () => {
    expect(formatResultRange(pagination({ total: 0, totalPages: 0 }))).toBe("");
  });
});
