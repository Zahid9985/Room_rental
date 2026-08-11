export const formatCurrency = (value?: number | null) => {
  if (value === null || value === undefined) return "Not listed";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
};

export const formatDate = (value?: string | null) => {
  if (!value) return "Available now";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(value));
};

export const humanizeEnum = (value?: string | null) =>
  value ? value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase()) : "";
