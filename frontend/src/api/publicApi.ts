import { api } from "./client";
import type { Amenity, Paginated, Property, PropertyType, Settings } from "./types";

export interface PropertyQuery {
  page?: number;
  limit?: number;
  search?: string;
  propertyType?: string;
  roomType?: string;
  furnishingStatus?: string;
  availableNow?: boolean;
  genderPreference?: string;
  amenities?: string;
  minRent?: number;
  maxRent?: number;
  sort?: string;
  lat?: number;
  lng?: number;
  radius?: number;
}

export const publicApi = {
  listProperties: async (params: PropertyQuery) => {
    const response = await api.get<Paginated<Property>>("/properties", { params });
    return response.data;
  },
  nearbyProperties: async (params: PropertyQuery & { lat: number; lng: number; radius: number }) => {
    const response = await api.get<Paginated<Property>>("/properties/nearby", { params });
    return response.data;
  },
  featuredProperties: async () => {
    const response = await api.get<Property[]>("/properties/featured");
    return response.data;
  },
  propertyDetails: async (slug: string, params?: Pick<PropertyQuery, "lat" | "lng">) => {
    const response = await api.get<Property>(`/properties/${slug}`, { params });
    return response.data;
  },
  propertyTypes: async () => {
    const response = await api.get<PropertyType[]>("/property-types");
    return response.data;
  },
  amenities: async () => {
    const response = await api.get<Amenity[]>("/amenities");
    return response.data;
  },
  settings: async () => {
    const response = await api.get<Settings>("/settings/public");
    return response.data;
  },
  createEnquiry: async (payload: {
    propertyId?: string;
    customerName: string;
    phone: string;
    email?: string;
    message?: string;
  }) => {
    const response = await api.post<{
      enquiry: unknown;
      contact: { phone: string; whatsappUrl: string };
    }>("/enquiries", payload);
    return response.data;
  }
};
