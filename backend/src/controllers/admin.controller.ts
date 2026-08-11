import type { Request, Response } from "express";
import { getDashboardStats } from "../services/dashboard.service.js";
import {
  archiveProperty,
  createProperty,
  getAdminProperties,
  getAdminPropertyById,
  updateProperty
} from "../services/property.service.js";
import {
  getAdminEnquiries,
  getAdminEnquiryById,
  updateEnquiryStatus
} from "../services/enquiry.service.js";
import {
  createOwner,
  deleteOwner,
  getOwner,
  listOwners,
  updateOwner
} from "../services/owner.service.js";
import { createVisit, deleteVisit, listVisits, updateVisit } from "../services/visit.service.js";
import { getSettings, updateSettings } from "../services/settings.service.js";

const uploadedFiles = (req: Request) => req.files as Record<string, Express.Multer.File[]> | undefined;

export const dashboard = async (_req: Request, res: Response) => {
  res.json(await getDashboardStats());
};

export const adminProperties = async (req: Request, res: Response) => {
  res.json(await getAdminProperties(req.query));
};

export const adminPropertyById = async (req: Request, res: Response) => {
  res.json(await getAdminPropertyById(String(req.params.id)));
};

export const adminCreateProperty = async (req: Request, res: Response) => {
  res.status(201).json(await createProperty(req.body, uploadedFiles(req)));
};

export const adminUpdateProperty = async (req: Request, res: Response) => {
  res.json(await updateProperty(String(req.params.id), req.body, uploadedFiles(req)));
};

export const adminArchiveProperty = async (req: Request, res: Response) => {
  res.json(await archiveProperty(String(req.params.id)));
};

export const adminEnquiries = async (req: Request, res: Response) => {
  res.json(await getAdminEnquiries(req.query));
};

export const adminEnquiryById = async (req: Request, res: Response) => {
  res.json(await getAdminEnquiryById(String(req.params.id)));
};

export const adminUpdateEnquiryStatus = async (req: Request, res: Response) => {
  res.json(await updateEnquiryStatus(String(req.params.id), req.body));
};

export const adminOwners = async (_req: Request, res: Response) => {
  res.json(await listOwners());
};

export const adminOwnerById = async (req: Request, res: Response) => {
  res.json(await getOwner(String(req.params.id)));
};

export const adminCreateOwner = async (req: Request, res: Response) => {
  res.status(201).json(await createOwner(req.body));
};

export const adminUpdateOwner = async (req: Request, res: Response) => {
  res.json(await updateOwner(String(req.params.id), req.body));
};

export const adminDeleteOwner = async (req: Request, res: Response) => {
  res.json(await deleteOwner(String(req.params.id)));
};

export const adminVisits = async (_req: Request, res: Response) => {
  res.json(await listVisits());
};

export const adminCreateVisit = async (req: Request, res: Response) => {
  res.status(201).json(await createVisit(req.body));
};

export const adminUpdateVisit = async (req: Request, res: Response) => {
  res.json(await updateVisit(String(req.params.id), req.body));
};

export const adminDeleteVisit = async (req: Request, res: Response) => {
  res.json(await deleteVisit(String(req.params.id)));
};

export const adminSettings = async (_req: Request, res: Response) => {
  res.json(await getSettings());
};

export const adminUpdateSettings = async (req: Request, res: Response) => {
  res.json(await updateSettings(req.body));
};
