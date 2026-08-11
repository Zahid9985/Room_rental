import { PrismaClient, type Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import slugify from "slugify";

const prisma = new PrismaClient();

const slug = (value: string) => slugify(value, { lower: true, strict: true, trim: true });

const propertyTypes = [
  "Single Room",
  "Shared Room",
  "PG",
  "Hostel",
  "1 BHK",
  "2 BHK",
  "Apartment",
  "House"
].map((name, index) => ({ name, slug: slug(name), sortOrder: index + 1 }));

const amenities = [
  "WiFi",
  "Bed",
  "AC",
  "Fan",
  "Kitchen",
  "Parking",
  "Attached Bathroom",
  "CCTV",
  "Water",
  "Electricity",
  "Furniture",
  "Balcony",
  "Geyser",
  "Security"
].map((name) => ({ name, slug: slug(name), icon: slug(name) }));

const owners = [
  { name: "Subhash Das", phone: "9876543210", email: "subhash@example.com", address: "Khagra, Berhampore" },
  { name: "Mitali Roy", phone: "9876543211", email: "mitali@example.com", address: "Gorabazar, Berhampore" },
  { name: "Arindam Saha", phone: "9876543212", email: "arindam@example.com", address: "Cossimbazar" },
  { name: "Nasima Khatun", phone: "9876543213", email: "nasima@example.com", address: "Saidabad, Berhampore" },
  { name: "Pradip Mondal", phone: "9876543214", email: "pradip@example.com", address: "Laldighi, Berhampore" },
  { name: "Farhana Begum", phone: "9876543215", email: "farhana@example.com", address: "Indraprastha, Berhampore" }
];

const propertySeeds = [
  ["Khagra furnished single room near market", "single-room", "Single Room", 6500, "Khagra", 24.1018, 88.2521, "FURNISHED", "STUDENTS", true],
  ["Premium PG room beside Berhampore station", "pg", "PG", 7200, "Station Road", 24.0982, 88.2675, "SEMI_FURNISHED", "WORKING_PROFESSIONALS", true],
  ["Quiet 1 BHK close to Girls College", "1-bhk", "1 BHK", 10500, "Gorabazar", 24.1039, 88.2653, "FURNISHED", "FAMILY", true],
  ["Budget shared room in Saidabad", "shared-room", "Shared Room", 4200, "Saidabad", 24.0912, 88.2583, "UNFURNISHED", "STUDENTS", false],
  ["Two room apartment near Cossimbazar", "apartment", "Apartment", 13500, "Cossimbazar", 24.1204, 88.2762, "SEMI_FURNISHED", "FAMILY", true],
  ["Hostel bed with meals option", "hostel", "Hostel", 5100, "Laldighi", 24.1064, 88.2486, "FURNISHED", "STUDENTS", false],
  ["Airy 2 BHK for small family", "2-bhk", "2 BHK", 16000, "Indraprastha", 24.0946, 88.2721, "SEMI_FURNISHED", "FAMILY", true],
  ["Compact room near bus stand", "single-room", "Single Room", 5800, "Berhampore Bus Stand", 24.0973, 88.2591, "FURNISHED", "ANY", false],
  ["Women-friendly PG with CCTV", "pg", "PG", 7600, "Gorabazar", 24.106, 88.2631, "FURNISHED", "BACHELOR_FEMALE", true],
  ["Affordable room around Mohona", "single-room", "Single Room", 5400, "Mohona", 24.091, 88.2465, "UNFURNISHED", "ANY", false],
  ["Modern apartment near hospital", "apartment", "Apartment", 14500, "Hospital Road", 24.1024, 88.2708, "FURNISHED", "WORKING_PROFESSIONALS", true],
  ["Shared student room near college zone", "shared-room", "Shared Room", 3900, "College Para", 24.1091, 88.2569, "SEMI_FURNISHED", "STUDENTS", false],
  ["Independent house with parking", "house", "House", 18000, "Cantonment Road", 24.1121, 88.2693, "SEMI_FURNISHED", "FAMILY", false],
  ["Clean PG near textile market", "pg", "PG", 6800, "Khagra", 24.1006, 88.2504, "FURNISHED", "WORKING_PROFESSIONALS", true],
  ["Ground floor 1 BHK with kitchen", "1-bhk", "1 BHK", 9800, "Saidabad", 24.0898, 88.2606, "UNFURNISHED", "FAMILY", false],
  ["Semi furnished room near railway colony", "single-room", "Single Room", 6200, "Railway Colony", 24.0991, 88.2698, "SEMI_FURNISHED", "ANY", false],
  ["Balcony room for working professionals", "single-room", "Single Room", 8200, "Indraprastha", 24.0958, 88.2735, "FURNISHED", "WORKING_PROFESSIONALS", true],
  ["Family 2 BHK near Cossimbazar palace", "2-bhk", "2 BHK", 15500, "Cossimbazar", 24.123, 88.2784, "SEMI_FURNISHED", "FAMILY", false]
] as const;

async function main() {
  await prisma.scheduledVisit.deleteMany();
  await prisma.enquiry.deleteMany();
  await prisma.propertyAmenity.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.property.deleteMany();
  await prisma.owner.deleteMany();
  await prisma.amenity.deleteMany();
  await prisma.propertyType.deleteMany();
  await prisma.appSettings.deleteMany();
  await prisma.adminUser.deleteMany();

  const passwordHash = await bcrypt.hash("Admin@12345", 12);
  await prisma.adminUser.create({
    data: {
      name: "Sourav Admin",
      email: "admin@ssrooms.local",
      passwordHash
    }
  });

  const typeRows = await Promise.all(
    propertyTypes.map((type) => prisma.propertyType.create({ data: type }))
  );
  const typeBySlug = new Map(typeRows.map((type) => [type.slug, type]));

  const amenityRows = await Promise.all(
    amenities.map((amenity) => prisma.amenity.create({ data: amenity }))
  );
  const amenityBySlug = new Map(amenityRows.map((amenity) => [amenity.slug, amenity]));

  const ownerRows = await Promise.all(owners.map((owner) => prisma.owner.create({ data: owner })));

  const amenitySets = [
    ["wifi", "bed", "fan", "attached-bathroom", "water", "electricity"],
    ["wifi", "bed", "ac", "kitchen", "cctv", "security"],
    ["bed", "fan", "kitchen", "parking", "water", "electricity"],
    ["wifi", "furniture", "balcony", "geyser", "security"],
    ["bed", "fan", "cctv", "water", "electricity"]
  ];

  for (const [index, seed] of propertySeeds.entries()) {
    const [title, typeSlug, roomType, monthlyRent, locality, latitude, longitude, furnishingStatus, preferredTenant, featured] =
      seed;
    const propertyCode = `BRP-${String(index + 1).padStart(4, "0")}`;
    const selectedAmenities = amenitySets[index % amenitySets.length]
      .map((amenitySlug) => amenityBySlug.get(amenitySlug)?.id)
      .filter(Boolean) as string[];

    const data: Prisma.PropertyCreateInput = {
      propertyCode,
      title,
      slug: slug(`${title}-${propertyCode}`),
      description:
        "A verified rental option added by the SS Room Rentals team. The property is positioned for easy local access, clear pricing, and quick enquiry handling through the middleman.",
      propertyType: { connect: { id: typeBySlug.get(typeSlug)!.id } },
      owner: { connect: { id: ownerRows[index % ownerRows.length].id } },
      roomType,
      monthlyRent,
      securityDeposit: Math.round(monthlyRent * 1.5),
      maintenanceCharge: index % 3 === 0 ? 500 : 0,
      otherCharges: index % 4 === 0 ? "Electricity as per meter" : undefined,
      address: `${locality}, Berhampore, Murshidabad`,
      locality,
      city: "Berhampore",
      state: "West Bengal",
      postalCode: "742101",
      latitude,
      longitude,
      furnishingStatus,
      availableFrom: new Date(Date.now() + (index % 5) * 24 * 60 * 60 * 1000),
      preferredTenant,
      genderPreference:
        preferredTenant === "BACHELOR_FEMALE" ? "Female preferred" : preferredTenant === "BACHELOR_MALE" ? "Male preferred" : undefined,
      bedrooms: roomType.includes("2") ? 2 : roomType.includes("1") ? 1 : 1,
      bathrooms: index % 4 === 0 ? 2 : 1,
      attachedBathroom: index % 2 === 0,
      floor: index % 4,
      totalFloors: 4,
      status: index === 5 ? "RESERVED" : "AVAILABLE",
      featured,
      verified: true,
      rules: [
        "Valid ID required before visit",
        index % 2 === 0 ? "No smoking inside the room" : "Visitors allowed until 8 PM",
        "Advance notice required before vacating"
      ],
      nearbyLandmarks: [
        "Berhampore Railway Station",
        "Krishnath College",
        "Local market",
        index % 2 === 0 ? "Bus stand" : "Hospital"
      ],
      images: {
        create: [
          {
            url: "/uploads/room_rent.jpeg",
            alt: title,
            isCover: true,
            sortOrder: 0
          },
          {
            url: "/uploads/room_rent.jpeg",
            alt: `${title} gallery`,
            isCover: false,
            sortOrder: 1
          }
        ]
      },
      amenities: {
        create: selectedAmenities.map((amenityId) => ({
          amenity: { connect: { id: amenityId } }
        }))
      }
    };

    await prisma.property.create({ data });
  }

  const firstProperty = await prisma.property.findFirst({ orderBy: { propertyCode: "asc" } });
  if (firstProperty) {
    await prisma.enquiry.createMany({
      data: [
        {
          propertyId: firstProperty.id,
          customerName: "Rahul Das",
          phone: "9000000001",
          email: "rahul@example.com",
          message: "I want to visit this room tomorrow.",
          status: "NEW"
        },
        {
          propertyId: firstProperty.id,
          customerName: "Priya Sen",
          phone: "9000000002",
          email: "priya@example.com",
          message: "Is the security deposit negotiable?",
          status: "CONTACTED"
        }
      ]
    });
  }

  await prisma.appSettings.createMany({
    data: [
      { key: "businessName", value: "SS Room Rentals" },
      { key: "contactPhone", value: "+919876543210" },
      { key: "whatsappNumber", value: "919876543210" },
      { key: "serviceCity", value: "Berhampore" },
      { key: "defaultSearchRadiusKm", value: "5" }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.info("Seed complete. Admin: admin@ssrooms.local / Admin@12345");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
