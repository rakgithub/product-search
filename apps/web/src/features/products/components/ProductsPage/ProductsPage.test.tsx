import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProductsPage } from "./ProductsPage";
import * as api from "../../api/searchProducts";
import { ibuprofen, vitaminD } from "../../../../test/fixtures";

vi.mock("../../api/searchProducts");
const searchProducts = vi.mocked(api.searchProducts);

beforeEach(() => vi.resetAllMocks());

describe("ProductsPage header", () => {
  it("shows the visible result range once loaded", async () => {
    searchProducts.mockResolvedValue({
      items: [ibuprofen, vitaminD],
      pagination: { page: 1, pageSize: 10, total: 12, totalPages: 2 },
    });

    render(<ProductsPage />);

    expect(await screen.findByText("Showing 1–10 of 12 results")).toBeInTheDocument();
  });

  it("shows no range text while loading", () => {
    searchProducts.mockReturnValue(new Promise(() => {}));

    render(<ProductsPage />);

    expect(screen.queryByText(/Showing/)).not.toBeInTheDocument();
  });

  it("renders no empty paragraph in the header when there are no results", async () => {
    searchProducts.mockResolvedValue({
      items: [],
      pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 },
    });

    render(<ProductsPage />);

    await screen.findByRole("heading", { name: "Products", level: 1 });
    const header = screen.getByRole("banner");
    expect(header.querySelector("p")).toBeNull();
  });
});
