import { afterEach, describe, expect, it, vi } from "vitest";
import { searchProducts } from "./searchProducts";
import { EMPTY_FILTERS } from "../types";
import { ibuprofen } from "../../../test/fixtures";

const payload = {
  items: [ibuprofen],
  pagination: { page: 1, pageSize: 10, total: 1, totalPages: 1 },
};

function stubFetch() {
  const fn = vi.fn().mockResolvedValue({ ok: true, json: async () => payload });
  vi.stubGlobal("fetch", fn);
  return fn;
}

afterEach(() => vi.unstubAllGlobals());

describe("searchProducts", () => {
  it("calls /api/search without a query string when no filters are set", async () => {
    const fetchMock = stubFetch();

    await expect(searchProducts(EMPTY_FILTERS)).resolves.toEqual(payload);
    expect(fetchMock).toHaveBeenCalledWith("/api/search", { signal: undefined });
  });

  it("sends the filters and page as query params", async () => {
    const fetchMock = stubFetch();

    await searchProducts({ ...EMPTY_FILTERS, q: "ibuprofen", minPrice: "5" }, 2);

    expect(fetchMock).toHaveBeenCalledWith("/api/search?q=ibuprofen&minPrice=5&page=2", {
      signal: undefined,
    });
  });

  it("passes the abort signal to fetch", async () => {
    const fetchMock = stubFetch();
    const { signal } = new AbortController();

    await searchProducts(EMPTY_FILTERS, 1, signal);

    expect(fetchMock).toHaveBeenCalledWith("/api/search", { signal });
  });

  it("rejects when the server responds with an error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 400, statusText: "Bad Request" }));

    await expect(searchProducts(EMPTY_FILTERS)).rejects.toMatchObject({ status: 400 });
  });
});
