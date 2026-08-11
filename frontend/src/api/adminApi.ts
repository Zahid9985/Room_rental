import { api } from "./client";
import type { AdminUser, DashboardStats, Enquiry, Owner, Paginated, Property, Settings, Visit } from "./types";

export const adminApi = {
  login: async (email: string, password: string) => {
    const response = await api.post<{ token: string; admin: AdminUser }>("/admin/auth/login", {
      email,
      password
    });
    return response.data;
  },
  dashboard: async () => {
    const response = await api.get<DashboardStats>("/admin/dashboard");
    return response.data;
  },
  properties: async (params?: { page?: number; limit?: number; search?: string; sort?: string }) => {
    const response = await api.get<Paginated<Property>>("/admin/properties", { params });
    return response.data;
  },
  property: async (id: string) => {
    const response = await api.get<Property>(`/admin/properties/${id}`);
    return response.data;
  },
  createProperty: async (formData: FormData) => {
    const response = await api.post<Property>("/admin/properties", formData);
    return response.data;
  },
  updateProperty: async (id: string, formData: FormData) => {
    const response = await api.put<Property>(`/admin/properties/${id}`, formData);
    return response.data;
  },
  archiveProperty: async (id: string) => {
    const response = await api.delete<Property>(`/admin/properties/${id}`);
    return response.data;
  },
  enquiries: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
    const response = await api.get<Paginated<Enquiry>>("/admin/enquiries", { params });
    return response.data;
  },
  updateEnquiryStatus: async (
    id: string,
    payload: { status: string; internalNotes?: string; followUpAt?: string }
  ) => {
    const response = await api.patch<Enquiry>(`/admin/enquiries/${id}/status`, payload);
    return response.data;
  },
  owners: async () => {
    const response = await api.get<Owner[]>("/admin/owners");
    return response.data;
  },
  createOwner: async (payload: Partial<Owner>) => {
    const response = await api.post<Owner>("/admin/owners", payload);
    return response.data;
  },
  updateOwner: async (id: string, payload: Partial<Owner>) => {
    const response = await api.put<Owner>(`/admin/owners/${id}`, payload);
    return response.data;
  },
  deleteOwner: async (id: string) => {
    const response = await api.delete<Owner>(`/admin/owners/${id}`);
    return response.data;
  },
  visits: async () => {
    const response = await api.get<Visit[]>("/admin/visits");
    return response.data;
  },
  createVisit: async (payload: Partial<Visit> & { propertyId: string; scheduledAt: string }) => {
    const response = await api.post<Visit>("/admin/visits", payload);
    return response.data;
  },
  updateVisit: async (id: string, payload: Partial<Visit>) => {
    const response = await api.put<Visit>(`/admin/visits/${id}`, payload);
    return response.data;
  },
  settings: async () => {
    const response = await api.get<Settings>("/admin/settings");
    return response.data;
  },
  updateSettings: async (payload: Record<string, string>) => {
    const response = await api.put<Settings>("/admin/settings", payload);
    return response.data;
  }
};
