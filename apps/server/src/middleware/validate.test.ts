import type { NextFunction, Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { AppError } from "../errors/AppError.js";
import { validateQuery } from "./validate.js";

const schema = z.object({ n: z.coerce.number().int() }).strict();

const run = (query: unknown) => {
  const req = { query } as Request;
  const res = { locals: {} } as Response;
  const next = vi.fn() as unknown as NextFunction;
  validateQuery(schema)(req, res, next);
  return { res, next: next as unknown as ReturnType<typeof vi.fn> };
};

describe("validateQuery", () => {
  it("stores parsed data on res.locals.query and calls next() with no error", () => {
    const { res, next } = run({ n: "5" });
    expect(res.locals.query).toEqual({ n: 5 });
    expect(next).toHaveBeenCalledWith();
  });

  it("passes a 400 AppError with field details on failure", () => {
    const { res, next } = run({ n: "abc" });
    const err = next.mock.calls[0]![0] as AppError;
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.details).toEqual([{ field: "n", message: expect.any(String) }]);
    expect(res.locals.query).toBeUndefined();
  });

  it("rejects unknown keys", () => {
    const { next } = run({ n: "1", extra: "x" });
    expect((next.mock.calls[0]![0] as AppError).statusCode).toBe(400);
  });
});
