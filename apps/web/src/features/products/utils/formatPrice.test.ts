import { describe, expect, it } from "vitest";
import { formatPrice } from "./formatPrice";

// Intl uses a non-breaking space between amount and symbol.
const normalise = (s: string) => s.replace(/\s/g, " ");

describe("formatPrice", () => {
  it("formats a price in euros", () => {
    expect(normalise(formatPrice(6.49))).toBe("6,49 €");
  });

  it("always shows two decimals", () => {
    expect(normalise(formatPrice(6.2))).toBe("6,20 €");
    expect(normalise(formatPrice(10))).toBe("10,00 €");
  });

  it("adds thousands separators", () => {
    expect(normalise(formatPrice(1234.5))).toBe("1.234,50 €");
  });
});
