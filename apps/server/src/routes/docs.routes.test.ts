import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../app.js";

const app = createApp();

describe("OpenAPI docs", () => {
  it("serves a spec describing /search and its query params", async () => {
    const res = await request(app).get("/openapi.json");
    expect(res.status).toBe(200);
    const op = res.body.paths["/search"].get;
    expect(op.parameters.map((p: { name: string }) => p.name)).toEqual(
      ["q", "category", "brand", "minPrice", "maxPrice", "sort", "page"],
    );
    expect(res.body.paths).toHaveProperty(["/products", "get"]);
    expect(res.body.components.schemas).toHaveProperty("Product");
  });

  it("serves Swagger UI", async () => {
    const res = await request(app).get("/docs/");
    expect(res.status).toBe(200);
    expect(res.text).toContain("swagger-ui");
  });
});
