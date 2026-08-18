export type FurnishingStatus = "FURNISHED" | "SEMI_FURNISHED" | "UNFURNISHED";
export type PropertyStatus = "DRAFT" | "AVAILABLE" | "RESERVED" | "RENTED" | "INACTIVE" | "ARCHIVED";
export type EnquiryStatus =
  | "NEW"
  | "CONTACTED"
  | "VISIT_SCHEDULED"
  | "NEGOTIATING"
  | "CONVERTED"
  | "CLOSED"
  | "LOST";

export interface PropertyType {
  id: string;
  name: string;
  slug: string;
}

export interface Amenity {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
}

export interface PropertyImage {
  id: string;
  url: string;
  alt?: string | null;
  isCover: boolean;
  sortOrder: number;
}

export interface Owner {
  id: string;
  name: string;
  phone: string;
  alternatePhone?: string | null;
  email?: string | null;
  address?: string | null;
  notes?: string | null;
  _count?: { properties: number };
}

export interface Property {
  id: string;
  propertyCode: string;
  title: string;
  slug: string;
  description: string;
  propertyType: PropertyType;
  roomType?: string | null;
  monthlyRent: number;
  securityDeposit?: number | null;
  maintenanceCharge?: number | null;
  otherCharges?: string | null;
  address: string;
  locality: string;
  city: string;
  state: string;
  postalCode?: string | null;
  latitude: number;
  longitude: number;
  furnishingStatus: FurnishingStatus;
  availableFrom?: string | null;
  preferredTenant: string;
  genderPreference?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  attachedBathroom: boolean;
  floor?: number | null;
  totalFloors?: number | null;
  status: PropertyStatus;
  featured: boolean;
  verified: boolean;
  rules: string[];
  nearbyLandmarks: string[];
  images: PropertyImage[];
  coverImage?: string | null;
  amenities: Amenity[];
  distanceKm?: number;
  owner?: Owner;
  createdAt: string;
  updatedAt: string;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  radiusKm?: number;
}

export interface Enquiry {
  id: string;
  property?: Pick<Property, "id" | "propertyCode" | "title" | "slug" | "locality" | "monthlyRent"> | null;
  propertyId?: string | null;
  customerName: string;
  phone: string;
  email?: string | null;
  message?: string | null;
  source: string;
  status: EnquiryStatus;
  internalNotes?: string | null;
  followUpAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Visit {
  id: string;
  property: Pick<Property, "id" | "propertyCode" | "title" | "locality">;
  enquiry?: Pick<Enquiry, "id" | "customerName" | "phone" | "status"> | null;
  visitorName: string;
  phone: string;
  scheduledAt: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "MISSED";
  notes?: string | null;
}

export interface Settings {
  businessName: string;
  contactPerson?: string;
  contactPhone: string;
  whatsappNumber: string;
  email?: string;
  address?: string;
  businessHours?: string;
  operatingCity?: string;
  mapCenterLat?: number | string;
  mapCenterLng?: number | string;
  defaultMapZoom?: number | string;
  websiteName?: string;
  shortTagline?: string;
  serviceCity?: string;
  defaultSearchRadiusKm: number | string;
}

export interface DashboardStats {
  totalProperties: number;
  availableProperties: number;
  rentedProperties: number;
  inactiveProperties: number;
  newEnquiries: number;
  todaysEnquiries: number;
  scheduledVisits: number;
  recentProperties: Array<Pick<Property, "id" | "propertyCode" | "title" | "locality" | "monthlyRent" | "status" | "createdAt">>;
  recentEnquiries: Enquiry[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN";
}
