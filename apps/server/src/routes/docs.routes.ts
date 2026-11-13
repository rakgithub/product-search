import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { buildOpenApiDocument } from "../openapi/document.js";

export const docsRouter = Router();

const document = buildOpenApiDocument(); // built once at startup

docsRouter.get("/openapi.json", (_req, res) => {
  res.json(document);
});
docsRouter.use("/docs", swaggerUi.serve, swaggerUi.setup(document));
