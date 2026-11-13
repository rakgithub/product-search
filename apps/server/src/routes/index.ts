import { Router } from "express";
import { docsRouter } from "./docs.routes.js";
import { productsRouter } from "./products.routes.js";
import { searchRouter } from "./search.routes.js";

export const router = Router();
router.use("/products", productsRouter);
router.use("/search", searchRouter);
router.use(docsRouter);
