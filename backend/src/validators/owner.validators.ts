import { z } from "zod";
import { cleanOptionalString } from "./common.js";

export const ownerSchema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().min(7).max(20),
  alternatePhone: cleanOptionalString,
  email: z.string().email().optional().or(z.literal("")),
  address: cleanOptionalString,
  notes: cleanOptionalString
});
