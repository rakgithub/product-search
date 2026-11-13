import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../app.js";

const app = createApp();

describe("GET /products", () => {
  it("returns all products with a total", async () => {
    const res = await request(app).get("/products");
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(12);
    expect(res.body.items).toHaveLength(12);
    expect(res.body.items[0]).toEqual({
      id: "1",
      name: "Ibuprofen 400mg",
      description: expect.any(String),
      category: "pain-relief",
      brand: "Nurofen",
      price: 6.49,
    });
  });

  it("is not limited to one page, unlike /search", async () => {
    const [all, search] = await Promise.all([
      request(app).get("/products"),
      request(app).get("/search"),
    ]);
    expect(all.body.items.length).toBeGreaterThan(search.body.items.length);
  });
});
