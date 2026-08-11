import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/apiError.js";
import { boundingBoxForRadius, haversineDistanceKm } from "../utils/distance.js";
import { toSlug } from "../utils/slug.js";
import {
  nearbyQuerySchema,
  propertyListQuerySchema,
  propertyUpsertSchema
} from "../validators/property.validators.js";
import { toUploadUrl } from "../middleware/upload.js";

const publicPropertyInclude = {
  propertyType: true,
  images: { orderBy: [{ isCover: "desc" as const }, { sortOrder: "asc" as const }] },
  amenities: { include: { amenity: true } }
} satisfies Prisma.PropertyInclude;

const adminPropertyInclude = {
  ...publicPropertyInclude,
  owner: true
} satisfies Prisma.PropertyInclude;

type PublicPropertyRecord = Prisma.PropertyGetPayload<{ include: typeof publicPropertyInclude }>;
type AdminPropertyRecord = Prisma.PropertyGetPayload<{ include: typeof adminPropertyInclude }>;

const serializeProperty = (
  property: PublicPropertyRecord | AdminPropertyRecord,
  distanceKm?: number,
  includePrivate = false
) => {
  const owner = "owner" in property ? property.owner : undefined;

  return {
    id: property.id,
    propertyCode: property.propertyCode,
    title: property.title,
    slug: property.slug,
    description: property.description,
    propertyType: property.propertyType,
    roomType: property.roomType,
    monthlyRent: property.monthlyRent,
    securityDeposit: property.securityDeposit,
    maintenanceCharge: property.maintenanceCharge,
    otherCharges: property.otherCharges,
    address: property.address,
    locality: property.locality,
    city: property.city,
    state: property.state,
    postalCode: property.postalCode,
    latitude: property.latitude,
    longitude: property.longitude,
    furnishingStatus: property.furnishingStatus,
    availableFrom: property.availableFrom,
    preferredTenant: property.preferredTenant,
    genderPreference: property.genderPreference,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    attachedBathroom: property.attachedBathroom,
    floor: property.floor,
    totalFloors: property.totalFloors,
    status: property.status,
    featured: property.featured,
    verified: property.verified,
    rules: property.rules,
    nearbyLandmarks: property.nearbyLandmarks,
    images: property.images,
    coverImage: property.images.find((image) => image.isCover)?.url ?? property.images[0]?.url ?? null,
    amenities: property.amenities.map(({ amenity }) => amenity),
    distanceKm: typeof distanceKm === "number" ? Number(distanceKm.toFixed(1)) : undefined,
    owner: includePrivate && owner ? owner : undefined,
    createdAt: property.createdAt,
    updatedAt: property.updatedAt
  };
};

const buildPublicWhere = (
  query: ReturnType<typeof propertyListQuerySchema.parse>
): Prisma.PropertyWhereInput => {
  const and: Prisma.PropertyWhereInput[] = [];

  if (query.search) {
    and.push({
      OR: [
        { title: { contains: query.search, mode: "insensitive" } },
        { locality: { contains: query.search, mode: "insensitive" } },
        { city: { contains: query.search, mode: "insensitive" } },
        { address: { contains: query.search, mode: "insensitive" } },
        { propertyCode: { contains: query.search, mode: "insensitive" } },
        { nearbyLandmarks: { has: query.search } }
      ]
    });
  }

  if (query.locality) and.push({ locality: { contains: query.locality, mode: "insensitive" } });
  if (query.city) and.push({ city: { contains: query.city, mode: "insensitive" } });
  if (query.propertyType) and.push({ propertyType: { slug: query.propertyType } });
  if (query.roomType) and.push({ roomType: { contains: query.roomType, mode: "insensitive" } });
  if (query.furnishingStatus) and.push({ furnishingStatus: query.furnishingStatus });
  if (query.genderPreference) and.push({ genderPreference: query.genderPreference });
  if (query.minRent || query.maxRent) {
    and.push({
      monthlyRent: {
        gte: query.minRent,
        lte: query.maxRent
      }
    });
  }

  if (query.availableNow) {
    and.push({
      OR: [{ availableFrom: null }, { availableFrom: { lte: new Date() } }]
    });
  }

  query.amenities.forEach((slug) => {
    and.push({ amenities: { some: { amenity: { slug } } } });
  });

  return {
    status: "AVAILABLE",
    archivedAt: null,
    AND: and
  };
};

const sortToOrderBy = (sort: string): Prisma.PropertyOrderByWithRelationInput[] => {
  if (sort === "price_asc") return [{ monthlyRent: "asc" }, { createdAt: "desc" }];
  if (sort === "price_desc") return [{ monthlyRent: "desc" }, { createdAt: "desc" }];
  return [{ createdAt: "desc" }];
};

export const getPublicProperties = async (rawQuery: unknown) => {
  const query = propertyListQuerySchema.parse(rawQuery);
  const where = buildPublicWhere(query);
  const skip = (query.page - 1) * query.limit;

  const [items, total] = await prisma.$transaction([
    prisma.property.findMany({
      where,
      include: publicPropertyInclude,
      orderBy: sortToOrderBy(query.sort),
      skip,
      take: query.limit
    }),
    prisma.property.count({ where })
  ]);

  return {
    items: items.map((property) => {
      const distanceKm =
        typeof query.lat === "number" && typeof query.lng === "number"
          ? haversineDistanceKm(query.lat, query.lng, property.latitude, property.longitude)
          : undefined;
      return serializeProperty(property, distanceKm);
    }),
    page: query.page,
    limit: query.limit,
    total
  };
};

export const getFeaturedProperties = async () => {
  const items = await prisma.property.findMany({
    where: { status: "AVAILABLE", archivedAt: null, featured: true },
    include: publicPropertyInclude,
    orderBy: [{ createdAt: "desc" }],
    take: 6
  });

  return items.map((property) => serializeProperty(property));
};

export const getNearbyProperties = async (rawQuery: unknown) => {
  const query = nearbyQuerySchema.parse(rawQuery);
  const baseWhere = buildPublicWhere(query);
  const bounds = boundingBoxForRadius(query.lat, query.lng, query.radius);

  const candidates = await prisma.property.findMany({
    where: {
      ...baseWhere,
      latitude: { gte: bounds.minLat, lte: bounds.maxLat },
      longitude: { gte: bounds.minLng, lte: bounds.maxLng }
    },
    include: publicPropertyInclude,
    orderBy: sortToOrderBy(query.sort),
    take: 250
  });

  const nearby = candidates
    .map((property) => ({
      property,
      distanceKm: haversineDistanceKm(query.lat, query.lng, property.latitude, property.longitude)
    }))
    .filter((item) => item.distanceKm <= query.radius);

  if (query.sort === "nearest") {
    nearby.sort((a, b) => a.distanceKm - b.distanceKm);
  }

  const skip = (query.page - 1) * query.limit;
  return {
    items: nearby.slice(skip, skip + query.limit).map((item) => serializeProperty(item.property, item.distanceKm)),
    page: query.page,
    limit: query.limit,
    total: nearby.length,
    radiusKm: query.radius
  };
};

export const getPublicPropertyBySlug = async (slug: string, lat?: number, lng?: number) => {
  const property = await prisma.property.findFirst({
    where: { slug, status: "AVAILABLE", archivedAt: null },
    include: publicPropertyInclude
  });

  if (!property) throw new ApiError(404, "Property not found");

  const distanceKm =
    typeof lat === "number" && typeof lng === "number"
      ? haversineDistanceKm(lat, lng, property.latitude, property.longitude)
      : undefined;

  return serializeProperty(property, distanceKm);
};

export const getPropertyTypes = () =>
  prisma.propertyType.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
  });

export const getAmenities = () =>
  prisma.amenity.findMany({
    where: { active: true },
    orderBy: { name: "asc" }
  });

const generatePropertyCode = async () => {
  const count = await prisma.property.count();
  return `BRP-${String(count + 1).padStart(4, "0")}`;
};

const ensureUniqueSlug = async (title: string, ignoreId?: string) => {
  const base = toSlug(title);
  let candidate = base;
  let index = 2;

  while (
    await prisma.property.findFirst({
      where: { slug: candidate, id: ignoreId ? { not: ignoreId } : undefined }
    })
  ) {
    candidate = `${base}-${index}`;
    index += 1;
  }

  return candidate;
};

const uploadedImages = (files?: Record<string, Express.Multer.File[]>) => {
  const images: Array<{ url: string; isCover: boolean; sortOrder: number; alt?: string }> = [];
  files?.coverImage?.forEach((file) => {
    images.push({ url: toUploadUrl(file), isCover: true, sortOrder: 0, alt: file.originalname });
  });
  files?.galleryImages?.forEach((file, index) => {
    images.push({ url: toUploadUrl(file), isCover: false, sortOrder: index + 1, alt: file.originalname });
  });
  return images;
};

const imageRecordsFromInput = (
  body: ReturnType<typeof propertyUpsertSchema.parse>,
  files?: Record<string, Express.Multer.File[]>
) => {
  const records = uploadedImages(files);

  if (body.coverImageUrl) {
    records.unshift({ url: body.coverImageUrl, isCover: true, sortOrder: 0 });
  }

  body.galleryImageUrls.forEach((url, index) => {
    records.push({ url, isCover: false, sortOrder: records.length + index + 1 });
  });

  return records;
};

export const getAdminProperties = async (rawQuery: unknown) => {
  const query = propertyListQuerySchema.parse(rawQuery);
  const skip = (query.page - 1) * query.limit;
  const where: Prisma.PropertyWhereInput = {
    archivedAt: null,
    ...(query.search
      ? {
          OR: [
            { title: { contains: query.search, mode: "insensitive" } },
            { locality: { contains: query.search, mode: "insensitive" } },
            { propertyCode: { contains: query.search, mode: "insensitive" } },
            { owner: { name: { contains: query.search, mode: "insensitive" } } }
          ]
        }
      : {})
  };

  const [items, total] = await prisma.$transaction([
    prisma.property.findMany({
      where,
      include: adminPropertyInclude,
      orderBy: sortToOrderBy(query.sort),
      skip,
      take: query.limit
    }),
    prisma.property.count({ where })
  ]);

  return {
    items: items.map((property) => serializeProperty(property, undefined, true)),
    page: query.page,
    limit: query.limit,
    total
  };
};

export const getAdminPropertyById = async (id: string) => {
  const property = await prisma.property.findUnique({
    where: { id },
    include: adminPropertyInclude
  });

  if (!property) throw new ApiError(404, "Property not found");
  return serializeProperty(property, undefined, true);
};

export const createProperty = async (
  rawBody: unknown,
  files?: Record<string, Express.Multer.File[]>
) => {
  const body = propertyUpsertSchema.parse(rawBody);
  const { amenityIds, removeImageIds: _removeImageIds, coverImageUrl: _cover, galleryImageUrls: _gallery, ...data } = body;
  const propertyCode = await generatePropertyCode();
  const slug = await ensureUniqueSlug(body.title);
  const images = imageRecordsFromInput(body, files);

  const property = await prisma.property.create({
    data: {
      ...data,
      propertyCode,
      slug,
      images: images.length ? { create: images } : undefined,
      amenities: amenityIds.length
        ? {
            create: amenityIds.map((amenityId) => ({
              amenity: { connect: { id: amenityId } }
            }))
          }
        : undefined
    },
    include: adminPropertyInclude
  });

  return serializeProperty(property, undefined, true);
};

export const updateProperty = async (
  id: string,
  rawBody: unknown,
  files?: Record<string, Express.Multer.File[]>
) => {
  const body = propertyUpsertSchema.parse(rawBody);
  const { amenityIds, removeImageIds, coverImageUrl: _cover, galleryImageUrls: _gallery, ...data } = body;
  const slug = await ensureUniqueSlug(body.title, id);
  const images = imageRecordsFromInput(body, files);

  const property = await prisma.$transaction(async (tx) => {
    await tx.propertyAmenity.deleteMany({ where: { propertyId: id } });

    if (removeImageIds.length) {
      await tx.propertyImage.deleteMany({ where: { id: { in: removeImageIds }, propertyId: id } });
    }

    if (images.some((image) => image.isCover)) {
      await tx.propertyImage.updateMany({ where: { propertyId: id }, data: { isCover: false } });
    }

    const updated = await tx.property.update({
      where: { id },
      data: {
        ...data,
        slug,
        amenities: amenityIds.length
          ? {
              create: amenityIds.map((amenityId) => ({
                amenity: { connect: { id: amenityId } }
              }))
            }
          : undefined,
        images: images.length ? { create: images } : undefined
      },
      include: adminPropertyInclude
    });

    return updated;
  });

  return serializeProperty(property, undefined, true);
};

export const archiveProperty = async (id: string) => {
  const property = await prisma.property.update({
    where: { id },
    data: {
      status: "ARCHIVED",
      archivedAt: new Date()
    },
    include: adminPropertyInclude
  });

  return serializeProperty(property, undefined, true);
};
