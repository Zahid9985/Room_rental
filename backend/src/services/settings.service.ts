import { prisma } from "../config/prisma.js";

const defaultSettings: Record<string, string> = {
  businessName: "SS Room Rentals",
  contactPerson: "Sourav",
  contactPhone: "+919876543210",
  whatsappNumber: "919876543210",
  email: "hello@ssrooms.local",
  address: "Bardhaman, West Bengal",
  businessHours: "10 AM - 8 PM",
  operatingCity: "Bardhaman / Burdwan",
  mapCenterLat: "23.2324",
  mapCenterLng: "87.8615",
  defaultMapZoom: "13",
  websiteName: "SS Room Rentals",
  shortTagline: "Discover available rooms near you.",
  defaultSearchRadiusKm: "20",
  serviceCity: "Bardhaman / Burdwan"
};

export const getSettings = async () => {
  const stored = await prisma.appSettings.findMany();
  const settings = { ...defaultSettings };
  stored.forEach((item) => {
    settings[item.key] = item.value;
  });
  return settings;
};

export const getPublicSettings = async () => {
  const settings = await getSettings();
  return {
    businessName: settings.businessName,
    contactPerson: settings.contactPerson,
    contactPhone: settings.contactPhone,
    whatsappNumber: settings.whatsappNumber,
    email: settings.email,
    address: settings.address,
    businessHours: settings.businessHours,
    operatingCity: settings.operatingCity || settings.serviceCity,
    serviceCity: settings.serviceCity,
    mapCenterLat: Number(settings.mapCenterLat || 23.2324),
    mapCenterLng: Number(settings.mapCenterLng || 87.8615),
    defaultMapZoom: Number(settings.defaultMapZoom || 13),
    websiteName: settings.websiteName,
    shortTagline: settings.shortTagline,
    defaultSearchRadiusKm: Number(settings.defaultSearchRadiusKm || 5)
  };
};

export const updateSettings = async (settings: Record<string, string>) => {
  const entries = Object.entries(settings).map(([key, value]) => [key, String(value)] as const);

  await prisma.$transaction(
    entries.map(([key, value]) =>
      prisma.appSettings.upsert({
        where: { key },
        create: { key, value },
        update: { value }
      })
    )
  );

  return getSettings();
};
