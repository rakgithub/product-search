import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductCard } from "./ProductCard";
import { ibuprofen } from "../../../../test/fixtures";

describe("ProductCard", () => {
  it("shows the category, brand, name, description and formatted price", () => {
    render(<ProductCard product={ibuprofen} />);

    expect(screen.getByText("Pain relief")).toBeInTheDocument();
    expect(screen.getByText("Nurofen")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Ibuprofen 400mg" })).toBeInTheDocument();
    expect(screen.getByText("Pain relief tablets for headaches and fever")).toBeInTheDocument();
    expect(screen.getByText(/6,49\s€/)).toBeInTheDocument();
  });
});
