import { Router } from "express";
import { search } from "../controllers/search.controller.js";
import { validateQuery } from "../middleware/validate.js";
import { searchQuerySchema } from "../schemas/search.schema.js";

export const searchRouter = Router();

searchRouter.get("/", validateQuery(searchQuerySchema), search);
