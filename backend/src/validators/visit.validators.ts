import { z } from "zod";
import { cleanOptionalString } from "./common.js";

export const visitSchema = z.object({
  propertyId: z.string().uuid(),
  enquiryId: z.string().uuid().optional(),
  visitorName: z.string().min(2).max(120),
  phone: z.string().min(7).max(20),
  scheduledAt: z.coerce.date(),
  status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED", "MISSED"]).default("SCHEDULED"),
  notes: cleanOptionalString
});
