import type { Request, Response } from "express";
import { createEnquiry } from "../services/enquiry.service.js";

export const createPublicEnquiry = async (req: Request, res: Response) => {
  const result = await createEnquiry(req.body);
  res.status(201).json(result);
};
