import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/apiError.js";

export interface AdminTokenPayload {
  adminId: string;
  email: string;
  role: "ADMIN";
}

export interface AuthenticatedRequest extends Request {
  admin?: AdminTokenPayload;
}

export const requireAdmin = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) {
    next(new ApiError(401, "Admin authentication required"));
    return;
  }

  try {
    req.admin = jwt.verify(token, env.JWT_SECRET) as AdminTokenPayload;
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired admin token"));
  }
};
