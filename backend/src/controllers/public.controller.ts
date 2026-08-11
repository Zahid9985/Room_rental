import type { Request, Response } from "express";
import {
  getAmenities,
  getFeaturedProperties,
  getNearbyProperties,
  getPropertyTypes,
  getPublicProperties,
  getPublicPropertyBySlug
} from "../services/property.service.js";
import { getPublicSettings } from "../services/settings.service.js";

export const listProperties = async (req: Request, res: Response) => {
  res.json(await getPublicProperties(req.query));
};

export const featuredProperties = async (_req: Request, res: Response) => {
  res.json(await getFeaturedProperties());
};

export const nearbyProperties = async (req: Request, res: Response) => {
  res.json(await getNearbyProperties(req.query));
};

export const propertyDetails = async (req: Request, res: Response) => {
  const lat = typeof req.query.lat === "string" ? Number(req.query.lat) : undefined;
  const lng = typeof req.query.lng === "string" ? Number(req.query.lng) : undefined;
  res.json(await getPublicPropertyBySlug(String(req.params.slug), lat, lng));
};

export const propertyTypes = async (_req: Request, res: Response) => {
  res.json(await getPropertyTypes());
};

export const amenities = async (_req: Request, res: Response) => {
  res.json(await getAmenities());
};

export const publicSettings = async (_req: Request, res: Response) => {
  res.json(await getPublicSettings());
};
