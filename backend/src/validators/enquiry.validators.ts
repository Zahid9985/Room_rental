import { z } from "zod";
import { cleanOptionalString, optionalDate } from "./common.js";

export const enquiryCreateSchema = z.object({
  propertyId: z.string().uuid().optional(),
  customerName: z.string().min(2).max(120).optional(),
  phone: z.string().min(7).max(20).optional(),
  email: z.string().email().optional().or(z.literal("")),
  message: cleanOptionalString,
  source: z.string().default("Website"),
  contactMethod: z.enum(["WHATSAPP", "CALL", "FORM"]).optional()
});

export const enquiryListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  status: z
    .enum(["NEW", "CONTACTED", "VISIT_SCHEDULED", "NEGOTIATING", "CONVERTED", "CLOSED", "LOST"])
    .optional(),
  search: cleanOptionalString
});

export const enquiryStatusSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "VISIT_SCHEDULED", "NEGOTIATING", "CONVERTED", "CLOSED", "LOST"]),
  internalNotes: cleanOptionalString,
  followUpAt: optionalDate
});
