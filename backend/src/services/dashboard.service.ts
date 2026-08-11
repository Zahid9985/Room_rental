import { prisma } from "../config/prisma.js";

export const getDashboardStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalProperties,
    availableProperties,
    rentedProperties,
    newEnquiries,
    todaysEnquiries,
    scheduledVisits,
    recentProperties,
    recentEnquiries
  ] = await prisma.$transaction([
    prisma.property.count({ where: { archivedAt: null } }),
    prisma.property.count({ where: { status: "AVAILABLE", archivedAt: null } }),
    prisma.property.count({ where: { status: "RENTED", archivedAt: null } }),
    prisma.enquiry.count({ where: { status: "NEW" } }),
    prisma.enquiry.count({ where: { createdAt: { gte: today } } }),
    prisma.scheduledVisit.count({ where: { status: "SCHEDULED" } }),
    prisma.property.findMany({
      where: { archivedAt: null },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        propertyCode: true,
        title: true,
        locality: true,
        monthlyRent: true,
        status: true,
        createdAt: true
      }
    }),
    prisma.enquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        property: {
          select: {
            propertyCode: true,
            title: true
          }
        }
      }
    })
  ]);

  return {
    totalProperties,
    availableProperties,
    rentedProperties,
    newEnquiries,
    todaysEnquiries,
    scheduledVisits,
    recentProperties,
    recentEnquiries
  };
};
