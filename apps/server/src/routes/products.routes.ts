import { Router } from "express";
import { list } from "../controllers/products.controller.js";

export const productsRouter = Router();

productsRouter.get("/", list);
