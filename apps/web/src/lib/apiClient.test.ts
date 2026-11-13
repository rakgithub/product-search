import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiGet } from "./apiClient";

function mockFetch(response: Partial<Response>) {
  const fn = vi.fn().mockResolvedValue(response);
  vi.stubGlobal("fetch", fn);
  return fn;
}

afterEach(() => vi.unstubAllGlobals());

describe("apiGet", () => {
  it("prefixes the path with /api and returns parsed JSON", async () => {
    const fetchMock = mockFetch({ ok: true, json: async () => ({ hello: "world" }) });

    const result = await apiGet<{ hello: string }>("/products");

    expect(fetchMock).toHaveBeenCalledWith("/api/products", undefined);
    expect(result).toEqual({ hello: "world" });
  });

  it("forwards request init such as the abort signal", async () => {
    const fetchMock = mockFetch({ ok: true, json: async () => ({}) });
    const { signal } = new AbortController();

    await apiGet("/products", { signal });

    expect(fetchMock).toHaveBeenCalledWith("/api/products", { signal });
  });

  it("throws an ApiError carrying the status on a non-ok response", async () => {
    mockFetch({ ok: false, status: 500, statusText: "Internal Server Error" });

    const error = await apiGet("/products").catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 500, message: "Internal Server Error" });
  });
});
