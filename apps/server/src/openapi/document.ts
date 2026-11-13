import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import "./extend.js";
import { productListResponseSchema } from "../schemas/product.schema.js";
import {
  errorResponseSchema,
  searchQuerySchema,
  searchResponseSchema,
} from "../schemas/search.schema.js";

const registry = new OpenAPIRegistry();

registry.registerPath({
  method: "get",
  path: "/products",
  summary: "List all products",
  tags: ["Products"],
  responses: {
    200: {
      description: "Every product in the catalogue",
      content: { "application/json": { schema: productListResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/search",
  summary: "Search products",
  tags: ["Search"],
  request: { query: searchQuerySchema },
  responses: {
    200: {
      description: "Matching products, one page",
      content: { "application/json": { schema: searchResponseSchema } },
    },
    400: {
      description: "Invalid query parameters",
      content: { "application/json": { schema: errorResponseSchema } },
    },
  },
});

export function buildOpenApiDocument() {
  return new OpenApiGeneratorV3(registry.definitions).generateDocument({
    openapi: "3.0.3",
    info: { title: "Product Search API", version: "0.0.1" },
  });
}
