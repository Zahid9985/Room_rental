import { Router } from "express";
import { login } from "../controllers/auth.controller.js";
import {
  adminArchiveProperty,
  adminCreateOwner,
  adminCreateProperty,
  adminCreateVisit,
  adminDeleteOwner,
  adminDeleteVisit,
  adminEnquiries,
  adminEnquiryById,
  adminOwners,
  adminOwnerById,
  adminProperties,
  adminPropertyById,
  adminSettings,
  adminUpdateEnquiryStatus,
  adminUpdateOwner,
  adminUpdateProperty,
  adminUpdateSettings,
  adminUpdateVisit,
  adminVisits,
  dashboard
} from "../controllers/admin.controller.js";
import { requireAdmin } from "../middleware/auth.js";
import { imageUpload } from "../middleware/upload.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const adminRouter = Router();

adminRouter.post("/auth/login", asyncHandler(login));

adminRouter.use(requireAdmin);

adminRouter.get("/dashboard", asyncHandler(dashboard));

adminRouter.get("/properties", asyncHandler(adminProperties));
adminRouter.post(
  "/properties",
  imageUpload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 7 }
  ]),
  asyncHandler(adminCreateProperty)
);
adminRouter.get("/properties/:id", asyncHandler(adminPropertyById));
adminRouter.put(
  "/properties/:id",
  imageUpload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 7 }
  ]),
  asyncHandler(adminUpdateProperty)
);
adminRouter.delete("/properties/:id", asyncHandler(adminArchiveProperty));

adminRouter.get("/enquiries", asyncHandler(adminEnquiries));
adminRouter.get("/enquiries/:id", asyncHandler(adminEnquiryById));
adminRouter.patch("/enquiries/:id/status", asyncHandler(adminUpdateEnquiryStatus));

adminRouter.get("/owners", asyncHandler(adminOwners));
adminRouter.post("/owners", asyncHandler(adminCreateOwner));
adminRouter.get("/owners/:id", asyncHandler(adminOwnerById));
adminRouter.put("/owners/:id", asyncHandler(adminUpdateOwner));
adminRouter.delete("/owners/:id", asyncHandler(adminDeleteOwner));

adminRouter.get("/visits", asyncHandler(adminVisits));
adminRouter.post("/visits", asyncHandler(adminCreateVisit));
adminRouter.put("/visits/:id", asyncHandler(adminUpdateVisit));
adminRouter.delete("/visits/:id", asyncHandler(adminDeleteVisit));

adminRouter.get("/settings", asyncHandler(adminSettings));
adminRouter.put("/settings", asyncHandler(adminUpdateSettings));
