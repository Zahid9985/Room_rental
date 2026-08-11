import { Router } from "express";
import {
  amenities,
  featuredProperties,
  listProperties,
  nearbyProperties,
  propertyDetails,
  propertyTypes,
  publicSettings
} from "../controllers/public.controller.js";
import { createPublicEnquiry } from "../controllers/enquiry.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const publicRouter = Router();

publicRouter.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

publicRouter.get("/properties", asyncHandler(listProperties));
publicRouter.get("/properties/featured", asyncHandler(featuredProperties));
publicRouter.get("/properties/nearby", asyncHandler(nearbyProperties));
publicRouter.get("/properties/:slug", asyncHandler(propertyDetails));
publicRouter.get("/property-types", asyncHandler(propertyTypes));
publicRouter.get("/amenities", asyncHandler(amenities));
publicRouter.get("/settings/public", asyncHandler(publicSettings));
publicRouter.post("/enquiries", asyncHandler(createPublicEnquiry));
