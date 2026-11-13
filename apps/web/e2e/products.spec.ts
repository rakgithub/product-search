import { expect, test, type Page } from "@playwright/test";
import { API_URL } from "../playwright.config";

const cards = (page: Page) => page.getByRole("listitem");
const search = (page: Page) => page.getByRole("button", { name: "Search" });
const isSearchCall = (url: string) => new URL(url).pathname === "/api/search";

test.describe("Product browsing", () => {
  test("shows the first page of results from the real API", async ({ page, request }) => {
    const { items, pagination } = await (await request.get(`${API_URL}/search`)).json();

    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Products", level: 1 })).toBeVisible();
    await expect(cards(page)).toHaveCount(items.length);
    await expect(page.getByText(`${pagination.total} results`)).toBeVisible();
    for (const product of items) {
      await expect(page.getByRole("heading", { name: product.name, exact: true })).toBeVisible();
    }
  });

  test("renders a card with category, brand, description and price", async ({ page }) => {
    await page.goto("/");

    const card = cards(page).filter({
      has: page.getByRole("heading", { name: "Ibuprofen 400mg", exact: true }),
    });
    await expect(card).toContainText("Pain relief");
    await expect(card).toContainText("Nurofen");
    await expect(card).toContainText("Pain relief tablets for headaches and fever");
    await expect(card).toContainText(/6,49\s€/);
  });

  test("paginates through the results", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Page 1 of 2")).toBeVisible();
    await expect(cards(page)).toHaveCount(10);

    await page.getByRole("button", { name: "Next" }).click();

    await expect(page.getByText("Page 2 of 2")).toBeVisible();
    await expect(cards(page)).toHaveCount(2);
    await expect(page.getByRole("button", { name: "Next" })).toBeDisabled();
  });
});

test.describe("Filters", () => {
  test("only calls the search API when Search is clicked", async ({ page }) => {
    await page.goto("/");
    await expect(cards(page).first()).toBeVisible();

    let calls = 0;
    page.on("request", (req) => isSearchCall(req.url()) && calls++);

    await page.getByLabel("Name").fill("ibuprofen");
    await page.getByLabel("Category").selectOption("pain-relief");
    expect(calls).toBe(0);

    const request = page.waitForRequest((req) => isSearchCall(req.url()));
    await search(page).click();

    const url = new URL((await request).url());
    expect(url.searchParams.get("q")).toBe("ibuprofen");
    expect(url.searchParams.get("category")).toBe("pain-relief");
  });

  test("filters by name", async ({ page }) => {
    await page.goto("/");

    await page.getByLabel("Name").fill("ibuprofen");
    await search(page).click();

    await expect(cards(page)).toHaveCount(2);
    await expect(page.getByText("2 results")).toBeVisible();
  });

  test("filters by category and brand", async ({ page }) => {
    await page.goto("/");

    await page.getByLabel("Category").selectOption("skin-care");
    await page.getByLabel("Brand").selectOption("Eucerin");
    await search(page).click();

    await expect(cards(page)).toHaveCount(2);
    await expect(page.getByRole("heading", { name: "Sunscreen SPF 50" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Moisturising Cream" })).toBeVisible();
  });

  test("filters by price range", async ({ page }) => {
    await page.goto("/");

    await page.getByLabel("Minimum price").fill("5");
    await page.getByLabel("Maximum price").fill("7");
    await search(page).click();

    // Ibuprofen 6.49, Vitamin C 5.49, Magnesium 7.25 (out), Throat Lozenges 6.20
    await expect(cards(page)).toHaveCount(3);
    await expect(page.getByRole("heading", { name: "Ibuprofen 400mg", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Magnesium 400" })).toBeHidden();
  });

  test("combines filters", async ({ page }) => {
    await page.goto("/");

    await page.getByLabel("Category").selectOption("pain-relief");
    await page.getByLabel("Maximum price").fill("7");
    await search(page).click();

    await expect(cards(page)).toHaveCount(2);
  });

  test("shows a message when nothing matches", async ({ page }) => {
    await page.goto("/");

    await page.getByLabel("Name").fill("zzzz-no-such-product");
    await search(page).click();

    await expect(page.getByText("No products found")).toBeVisible();
  });

  test("prevents searching with min price above max price", async ({ page }) => {
    await page.goto("/");

    await page.getByLabel("Minimum price").fill("20");
    await page.getByLabel("Maximum price").fill("5");

    await expect(page.getByRole("alert")).toBeVisible();
    await expect(search(page)).toBeDisabled();
  });

  test("Reset clears the filters and shows all products again", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Name").fill("ibuprofen");
    await search(page).click();
    await expect(cards(page)).toHaveCount(2);

    await page.getByRole("button", { name: "Reset" }).click();

    await expect(page.getByLabel("Name")).toHaveValue("");
    await expect(cards(page)).toHaveCount(10);
  });
});

test.describe("Loading, error and empty states", () => {
  test("shows a loading message while the request is pending", async ({ page }) => {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => (release = resolve));
    await page.route(
      (url) => isSearchCall(url.href),
      async (route) => {
        await gate;
        await route.continue();
      },
    );

    await page.goto("/");
    await expect(page.getByText("Loading products...")).toBeVisible();

    release();
    await expect(page.getByText("Loading products...")).toBeHidden();
    await expect(cards(page).first()).toBeVisible();
  });

  test("shows an error message when the API fails", async ({ page }) => {
    await page.route(
      (url) => isSearchCall(url.href),
      (route) => route.fulfill({ status: 500 }),
    );

    await page.goto("/");

    await expect(page.getByText("Could not load products")).toBeVisible();
    await expect(cards(page)).toHaveCount(0);
  });
});
