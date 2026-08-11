import { prisma } from "../config/prisma.js";

const defaultSettings: Record<string, string> = {
  businessName: "SS Room Rentals",
  contactPhone: "+919876543210",
  whatsappNumber: "919876543210",
  serviceCity: "Berhampore",
  defaultSearchRadiusKm: "5"
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
    contactPhone: settings.contactPhone,
    whatsappNumber: settings.whatsappNumber,
    serviceCity: settings.serviceCity,
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
