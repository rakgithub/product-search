import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductList } from "./ProductList";
import { ibuprofen, vitaminD } from "../../../../test/fixtures";

describe("ProductList", () => {
  it("shows a loading message while fetching", () => {
    render(<ProductList products={[]} status="loading" />);
    expect(screen.getByText("Loading products...")).toBeInTheDocument();
  });

  it("shows an error message when loading fails", () => {
    render(<ProductList products={[]} status="error" />);
    expect(screen.getByText("Could not load products")).toBeInTheDocument();
  });

  it("shows an empty message when there are no products", () => {
    render(<ProductList products={[]} status="success" />);
    expect(screen.getByText("No products found")).toBeInTheDocument();
  });

  it("renders one card per product", () => {
    render(<ProductList products={[ibuprofen, vitaminD]} status="success" />);

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("heading", { name: "Ibuprofen 400mg" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Vitamin D3 1000 IU" })).toBeInTheDocument();
  });
});
