import type { EnquiryStatus, FurnishingStatus, PropertyStatus } from "../api/types";

export const BERHAMPORE_CENTER = {
  lat: 24.0988,
  lng: 88.2679
};

export const radiusOptions = [2, 5, 10, 20];

export const furnishingLabels: Record<FurnishingStatus, string> = {
  FURNISHED: "Furnished",
  SEMI_FURNISHED: "Semi furnished",
  UNFURNISHED: "Unfurnished"
};

export const propertyStatusLabels: Record<PropertyStatus, string> = {
  DRAFT: "Draft",
  AVAILABLE: "Available",
  RESERVED: "Reserved",
  RENTED: "Rented",
  INACTIVE: "Inactive",
  ARCHIVED: "Archived"
};

export const enquiryStatusLabels: Record<EnquiryStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  VISIT_SCHEDULED: "Visit scheduled",
  NEGOTIATING: "Negotiating",
  CONVERTED: "Converted",
  CLOSED: "Closed",
  LOST: "Lost"
};

export const enquiryStatuses = Object.keys(enquiryStatusLabels) as EnquiryStatus[];
export const propertyStatuses = Object.keys(propertyStatusLabels) as PropertyStatus[];

export const preferredTenantOptions = [
  { value: "ANY", label: "Any" },
  { value: "FAMILY", label: "Family" },
  { value: "BACHELOR_MALE", label: "Bachelor male" },
  { value: "BACHELOR_FEMALE", label: "Bachelor female" },
  { value: "STUDENTS", label: "Students" },
  { value: "WORKING_PROFESSIONALS", label: "Working professionals" }
];
