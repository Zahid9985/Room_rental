import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/apiError.js";
import {
  enquiryCreateSchema,
  enquiryListQuerySchema,
  enquiryStatusSchema
} from "../validators/enquiry.validators.js";
import { getPublicSettings } from "./settings.service.js";

const enquiryInclude = {
  property: {
    select: {
      id: true,
      propertyCode: true,
      title: true,
      slug: true,
      locality: true,
      monthlyRent: true
    }
  }
} satisfies Prisma.EnquiryInclude;

export const createEnquiry = async (rawBody: unknown) => {
  const body = enquiryCreateSchema.parse(rawBody);

  if (body.propertyId) {
    const exists = await prisma.property.findFirst({
      where: { id: body.propertyId, archivedAt: null },
      select: { id: true }
    });
    if (!exists) throw new ApiError(404, "Property not found");
  }

  const enquiry = await prisma.enquiry.create({
    data: {
      propertyId: body.propertyId,
      customerName: body.customerName || "WhatsApp visitor",
      phone: body.phone || body.contactMethod || "WHATSAPP_CLICK",
      email: body.email || undefined,
      message: body.message,
      source: body.contactMethod ? body.contactMethod : body.source
    },
    include: enquiryInclude
  });

  const settings = await getPublicSettings();
  const propertyText = enquiry.property
    ? `${enquiry.property.title}, Property ID ${enquiry.property.propertyCode}`
    : "a room listed on your website";
  const whatsappMessage = encodeURIComponent(`Hi, I'm interested in ${propertyText}. Please contact me.`);

  return {
    enquiry,
    contact: {
      phone: settings.contactPhone,
      whatsappUrl: `https://wa.me/${settings.whatsappNumber}?text=${whatsappMessage}`
    }
  };
};

export const getAdminEnquiries = async (rawQuery: unknown) => {
  const query = enquiryListQuerySchema.parse(rawQuery);
  const skip = (query.page - 1) * query.limit;
  const where: Prisma.EnquiryWhereInput = {
    ...(query.status ? { status: query.status } : {}),
    ...(query.search
      ? {
          OR: [
            { customerName: { contains: query.search, mode: "insensitive" } },
            { phone: { contains: query.search, mode: "insensitive" } },
            { email: { contains: query.search, mode: "insensitive" } },
            { property: { title: { contains: query.search, mode: "insensitive" } } },
            { property: { propertyCode: { contains: query.search, mode: "insensitive" } } }
          ]
        }
      : {})
  };

  const [items, total] = await prisma.$transaction([
    prisma.enquiry.findMany({
      where,
      include: enquiryInclude,
      orderBy: { createdAt: "desc" },
      skip,
      take: query.limit
    }),
    prisma.enquiry.count({ where })
  ]);

  return { items, page: query.page, limit: query.limit, total };
};

export const getAdminEnquiryById = async (id: string) => {
  const enquiry = await prisma.enquiry.findUnique({
    where: { id },
    include: enquiryInclude
  });

  if (!enquiry) throw new ApiError(404, "Enquiry not found");
  return enquiry;
};

export const updateEnquiryStatus = async (id: string, rawBody: unknown) => {
  const body = enquiryStatusSchema.parse(rawBody);
  return prisma.enquiry.update({
    where: { id },
    data: body,
    include: enquiryInclude
  });
};
