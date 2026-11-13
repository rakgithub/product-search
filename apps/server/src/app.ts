import express from "express";
import cors from "cors";
import { router } from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use(router);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
