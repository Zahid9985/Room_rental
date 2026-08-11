import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/apiError.js";
import { env } from "../config/env.js";

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(422).json({
      message: "Validation failed",
      errors: error.issues
    });
    return;
  }

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      message: error.message,
      details: error.details
    });
    return;
  }

  const statusCode = typeof error?.statusCode === "number" ? error.statusCode : 500;
  res.status(statusCode).json({
    message: statusCode === 500 ? "Internal server error" : error.message,
    stack: env.NODE_ENV === "development" ? error.stack : undefined
  });
};
