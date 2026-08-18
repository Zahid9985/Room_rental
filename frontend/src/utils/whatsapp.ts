import type { Property, Settings } from "../api/types";
import { formatCurrency } from "./format";

const normalizeWhatsAppNumber = (value?: string | null) => (value || "").replace(/[^\d]/g, "");

export const buildWhatsAppUrl = (property: Property | null, settings: Settings) => {
  const phone = normalizeWhatsAppNumber(settings.whatsappNumber);
  const lines = property
    ? [
        "Hi, I'm interested in this room.",
        "",
        `Property ID: ${property.propertyCode}`,
        `Location: ${property.locality}, ${property.city}`,
        `Rent: ${formatCurrency(property.monthlyRent)}/month`,
        `Property Type: ${property.propertyType.name}`,
        `Property: ${window.location.origin}/?property=${property.slug}`,
        "",
        "I would like to know more about this room."
      ]
    : [
        "Hi, I'm looking for a room.",
        "",
        `City: ${settings.operatingCity || settings.serviceCity || "Bardhaman"}`,
        "",
        "Please help me find a suitable property."
      ];

  return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join("\n"))}`;
};
