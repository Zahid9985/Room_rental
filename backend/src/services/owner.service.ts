import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/apiError.js";
import { ownerSchema } from "../validators/owner.validators.js";

export const listOwners = () =>
  prisma.owner.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { properties: true } } }
  });

export const getOwner = async (id: string) => {
  const owner = await prisma.owner.findUnique({
    where: { id },
    include: { properties: true }
  });
  if (!owner) throw new ApiError(404, "Owner not found");
  return owner;
};

export const createOwner = (rawBody: unknown) => {
  const body = ownerSchema.parse(rawBody);
  return prisma.owner.create({ data: { ...body, email: body.email || undefined } });
};

export const updateOwner = async (id: string, rawBody: unknown) => {
  const body = ownerSchema.parse(rawBody);
  return prisma.owner.update({ where: { id }, data: { ...body, email: body.email || undefined } });
};

export const deleteOwner = async (id: string) => {
  const activeProperties = await prisma.property.count({ where: { ownerId: id, archivedAt: null } });
  if (activeProperties > 0) {
    throw new ApiError(409, "Owner has active properties. Archive or reassign them first.");
  }

  return prisma.owner.delete({ where: { id } });
};
