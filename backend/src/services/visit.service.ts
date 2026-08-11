import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/apiError.js";
import { visitSchema } from "../validators/visit.validators.js";

const visitInclude = {
  property: { select: { id: true, propertyCode: true, title: true, locality: true } },
  enquiry: { select: { id: true, customerName: true, phone: true, status: true } }
} satisfies Prisma.ScheduledVisitInclude;

export const listVisits = () =>
  prisma.scheduledVisit.findMany({
    orderBy: { scheduledAt: "asc" },
    include: visitInclude
  });

export const createVisit = (rawBody: unknown) => {
  const body = visitSchema.parse(rawBody);
  return prisma.scheduledVisit.create({ data: body, include: visitInclude });
};

export const updateVisit = (id: string, rawBody: unknown) => {
  const body = visitSchema.partial().parse(rawBody);
  return prisma.scheduledVisit.update({ where: { id }, data: body, include: visitInclude });
};

export const deleteVisit = async (id: string) => {
  try {
    return await prisma.scheduledVisit.delete({ where: { id } });
  } catch {
    throw new ApiError(404, "Visit not found");
  }
};
