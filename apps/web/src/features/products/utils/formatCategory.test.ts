import { describe, expect, it } from "vitest";
import { formatCategory } from "./formatCategory";

describe("formatCategory", () => {
  it("turns a slug into a readable label", () => {
    expect(formatCategory("pain-relief")).toBe("Pain relief");
    expect(formatCategory("vitamins")).toBe("Vitamins");
    expect(formatCategory("cold-flu")).toBe("Cold flu");
  });
});
