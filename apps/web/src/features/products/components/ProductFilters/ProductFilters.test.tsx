import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ProductFilters } from "./ProductFilters";
import { EMPTY_FILTERS } from "../../types";

function setup() {
  const onSearch = vi.fn();
  const user = userEvent.setup();
  render(<ProductFilters onSearch={onSearch} />);
  return { onSearch, user };
}

describe("ProductFilters", () => {
  it("renders name, category, brand and price range filters with a search button", () => {
    setup();

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Category")).toBeInTheDocument();
    expect(screen.getByLabelText("Brand")).toBeInTheDocument();
    expect(screen.getByLabelText("Minimum price")).toBeInTheDocument();
    expect(screen.getByLabelText("Maximum price")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });

  it("does not search while the user is just editing the filters", async () => {
    const { onSearch, user } = setup();

    await user.type(screen.getByLabelText("Name"), "ibuprofen");
    await user.selectOptions(screen.getByLabelText("Category"), "pain-relief");

    expect(onSearch).not.toHaveBeenCalled();
  });

  it("searches with the entered values when Search is clicked", async () => {
    const { onSearch, user } = setup();

    await user.type(screen.getByLabelText("Name"), "cream");
    await user.selectOptions(screen.getByLabelText("Category"), "skin-care");
    await user.selectOptions(screen.getByLabelText("Brand"), "Eucerin");
    await user.type(screen.getByLabelText("Minimum price"), "10");
    await user.type(screen.getByLabelText("Maximum price"), "20");
    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith({
      q: "cream",
      category: "skin-care",
      brand: "Eucerin",
      minPrice: "10",
      maxPrice: "20",
    });
  });

  it("searches when Enter is pressed in the name field", async () => {
    const { onSearch, user } = setup();

    await user.type(screen.getByLabelText("Name"), "vitamin{Enter}");

    expect(onSearch).toHaveBeenCalledWith({ ...EMPTY_FILTERS, q: "vitamin" });
  });

  it("blocks the search and shows an error when min price is above max price", async () => {
    const { onSearch, user } = setup();

    await user.type(screen.getByLabelText("Minimum price"), "20");
    await user.type(screen.getByLabelText("Maximum price"), "5");

    expect(screen.getByRole("alert")).toHaveTextContent(/minimum price/i);
    expect(screen.getByRole("button", { name: "Search" })).toBeDisabled();
    await user.type(screen.getByLabelText("Name"), "x{Enter}");
    expect(onSearch).not.toHaveBeenCalled();
  });

  it("clears the form and searches with empty filters on Reset", async () => {
    const { onSearch, user } = setup();
    await user.type(screen.getByLabelText("Name"), "cream");
    await user.selectOptions(screen.getByLabelText("Brand"), "Eucerin");

    await user.click(screen.getByRole("button", { name: "Reset" }));

    expect(screen.getByLabelText("Name")).toHaveValue("");
    expect(screen.getByLabelText("Brand")).toHaveValue("");
    expect(onSearch).toHaveBeenCalledWith(EMPTY_FILTERS);
  });
});
