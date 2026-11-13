import type { RequestHandler } from "express";
import type { ZodTypeAny } from "zod";
import { AppError } from "../errors/AppError.js";

/**
 * Validates req.query against a Zod schema and stores the parsed, typed
 * result on res.locals.query (Express 4's req.query shouldn't be reassigned).
 */
export const validateQuery =
  (schema: ZodTypeAny): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join(".") || undefined,
        message: issue.message,
      }));
      return next(new AppError(400, "Invalid query parameters", details));
    }
    res.locals.query = result.data;
    next();
  };
