import type { NextFunction, Request, Response } from "express";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppError } from "../errors/AppError.js";
import { errorHandler, notFound } from "./errorHandler.js";

const mockRes = () => {
  const res = { status: vi.fn(), json: vi.fn() };
  res.status.mockReturnValue(res);
  return res;
};

afterEach(() => vi.restoreAllMocks());

describe("notFound", () => {
  it("forwards a 404 AppError naming the method and path", () => {
    const next = vi.fn();
    notFound({ method: "POST", path: "/nope" } as Request, {} as Response, next as NextFunction);
    const err = next.mock.calls[0]![0] as AppError;
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe("Route POST /nope not found");
  });
});

describe("errorHandler", () => {
  it("responds with the AppError status, message and details", () => {
    const res = mockRes();
    errorHandler(
      new AppError(400, "Bad", [{ field: "q" }]),
      {} as Request,
      res as unknown as Response,
      vi.fn(),
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: { message: "Bad", details: [{ field: "q" }] } });
  });

  it("hides internals for unexpected errors and returns 500", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const res = mockRes();
    errorHandler(
      new Error("db password leaked"),
      {} as Request,
      res as unknown as Response,
      vi.fn(),
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: { message: "Internal server error" } });
  });
});
