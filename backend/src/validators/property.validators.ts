import { z } from "zod";
import {
  booleanFromQuery,
  cleanOptionalString,
  optionalDate,
  optionalInteger,
  optionalNumber,
  stringArray
} from "./common.js";

export const propertyListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
  search: cleanOptionalString,
  locality: cleanOptionalString,
  city: cleanOptionalString,
  propertyType: cleanOptionalString,
  roomType: cleanOptionalString,
  furnishingStatus: z
    .enum(["FURNISHED", "SEMI_FURNISHED", "UNFURNISHED"])
    .optional(),
  availableNow: booleanFromQuery,
  genderPreference: cleanOptionalString,
  amenities: stringArray,
  minRent: optionalInteger,
  maxRent: optionalInteger,
  sort: z
    .enum(["nearest", "price_asc", "price_desc", "recent"])
    .default("recent"),
  lat: optionalNumber,
  lng: optionalNumber
});

export const nearbyQuerySchema = propertyListQuerySchema.extend({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().positive().max(50).default(5)
});

export const slugParamSchema = z.object({
  slug: z.string().min(1)
});

export const idParamSchema = z.object({
  id: z.string().uuid()
});

export const propertyUpsertSchema = z.object({
  title: z.string().min(3).max(160),
  description: z.string().min(20),
  propertyTypeId: z.string().uuid(),
  ownerId: z.string().uuid(),
  roomType: cleanOptionalString,
  monthlyRent: z.coerce.number().int().positive(),
  securityDeposit: optionalInteger,
  maintenanceCharge: optionalInteger,
  otherCharges: cleanOptionalString,
  address: z.string().min(6),
  locality: z.string().min(2),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: cleanOptionalString,
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  furnishingStatus: z.enum(["FURNISHED", "SEMI_FURNISHED", "UNFURNISHED"]),
  availableFrom: optionalDate,
  preferredTenant: z
    .enum(["ANY", "FAMILY", "BACHELOR_MALE", "BACHELOR_FEMALE", "STUDENTS", "WORKING_PROFESSIONALS"])
    .default("ANY"),
  genderPreference: cleanOptionalString,
  bedrooms: optionalInteger,
  bathrooms: optionalInteger,
  attachedBathroom: z.preprocess(
    (value) => value === true || value === "true" || value === "on" || value === "1",
    z.boolean().default(false)
  ),
  floor: optionalInteger,
  totalFloors: optionalInteger,
  status: z
    .enum(["DRAFT", "AVAILABLE", "RESERVED", "RENTED", "INACTIVE", "ARCHIVED"])
    .default("DRAFT"),
  featured: z.preprocess(
    (value) => value === true || value === "true" || value === "on" || value === "1",
    z.boolean().default(false)
  ),
  verified: z.preprocess(
    (value) => value === true || value === "true" || value === "on" || value === "1",
    z.boolean().default(true)
  ),
  rules: stringArray,
  nearbyLandmarks: stringArray,
  amenityIds: stringArray,
  coverImageUrl: cleanOptionalString,
  galleryImageUrls: stringArray,
  removeImageIds: stringArray
});
