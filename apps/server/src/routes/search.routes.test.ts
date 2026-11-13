import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../app.js";

const app = createApp();

describe("GET /search", () => {
  it("returns the first page of all products with no params", async () => {
    const res = await request(app).get("/search");
    expect(res.status).toBe(200);
    expect(res.body.pagination).toEqual({ page: 1, pageSize: 10, total: 12, totalPages: 2 });
    expect(res.body.items).toHaveLength(10);
  });

  it("treats empty params as not provided", async () => {
    const res = await request(app).get("/search?q=&category=&brand=&minPrice=&sort=&page=");
    expect(res.status).toBe(200);
    expect(res.body.pagination.total).toBe(12);
  });

  it("filters by q, ranking name matches first", async () => {
    const res = await request(app).get("/search?q=ibuprofen");
    expect(res.body.items.map((p: { id: string }) => p.id)).toEqual(["1", "11"]);
  });

  it("filters by category, brand (case-insensitive) and minPrice", async () => {
    const res = await request(app).get("/search?category=Skin-Care&brand=eucerin&minPrice=15");
    expect(res.body.items.map((p: { id: string }) => p.id)).toEqual(["9"]);
  });

  it("filters by a price range", async () => {
    const res = await request(app).get("/search?minPrice=5&maxPrice=7");
    const prices = res.body.items.map((p: { price: number }) => p.price);
    expect(prices.length).toBeGreaterThan(0);
    expect(prices.every((p: number) => p >= 5 && p <= 7)).toBe(true);
  });

  it("sorts by price", async () => {
    const res = await request(app).get("/search?category=vitamins&sort=price_desc");
    const prices = res.body.items.map((p: { price: number }) => p.price);
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  it("paginates", async () => {
    const res = await request(app).get("/search?page=2");
    expect(res.body.items).toHaveLength(2);
  });

  it.each([
    ["minPrice=-1", "minPrice"],
    ["minPrice=abc", "minPrice"],
    ["maxPrice=-1", "maxPrice"],
    ["minPrice=20&maxPrice=5", "minPrice"],
    ["page=0", "page"],
    ["page=1.5", "page"],
    ["sort=random", "sort"],
    ["q=a&q=b", "q"],
    [`q=${"x".repeat(101)}`, "q"],
  ])("rejects invalid %s", async (qs, field) => {
    const res = await request(app).get(`/search?${qs}`);
    expect(res.status).toBe(400);
    expect(res.body.error.details[0].field).toBe(field);
  });

  it("rejects unknown query params", async () => {
    const res = await request(app).get("/search?color=red");
    expect(res.status).toBe(400);
  });
});
