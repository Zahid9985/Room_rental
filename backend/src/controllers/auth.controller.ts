import type { Request, Response } from "express";
import { loginAdmin } from "../services/auth.service.js";

export const login = async (req: Request, res: Response) => {
  const result = await loginAdmin(req.body);
  res.json(result);
};
