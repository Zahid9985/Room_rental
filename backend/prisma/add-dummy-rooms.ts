import { PrismaClient, type Amenity, type Owner, type PropertyType } from "@prisma/client";
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
];

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
];

const owners = [
  {
    name: "Sanjay Agarwal",
    phone: "9800001101",
    email: "sanjay.owner@example.com",
    address: "BC Road, Bardhaman",
    notes: "Dummy owner for demo listings"
  },
  {
    name: "Mousumi Banerjee",
    phone: "9800001102",
    email: "mousumi.owner@example.com",
    address: "Golapbag, Bardhaman",
    notes: "Dummy owner for demo listings"
  },
  {
    name: "Amitava Dutta",
    phone: "9800001103",
    email: "amitava.owner@example.com",
    address: "Khosbagan, Bardhaman",
    notes: "Dummy owner for demo listings"
  }
];

const rooms = [
  {
    propertyCode: "BRD-0001",
    title: "Furnished single room near Curzon Gate",
    type: "Single Room",
    roomType: "Single Room",
    rent: 5500,
    locality: "Curzon Gate",
    address: "Curzon Gate, Bardhaman, West Bengal",
    lat: 23.2324,
    lng: 87.8615,
    furnishing: "FURNISHED" as const,
    preferredTenant: "STUDENTS" as const,
    bedrooms: 1,
    bathrooms: 1,
    floor: 1,
    amenities: ["WiFi", "Bed", "Fan", "Attached Bathroom", "Water", "Electricity"]
  },
  {
    propertyCode: "BRD-0002",
    title: "Student PG room beside Golapbag campus",
    type: "PG",
    roomType: "PG Room",
    rent: 6200,
    locality: "Golapbag",
    address: "Near Golapbag Campus, Bardhaman, West Bengal",
    lat: 23.2491,
    lng: 87.8467,
    furnishing: "FURNISHED" as const,
    preferredTenant: "STUDENTS" as const,
    bedrooms: 1,
    bathrooms: 1,
    floor: 2,
    amenities: ["WiFi", "Bed", "CCTV", "Security", "Water", "Electricity"]
  },
  {
    propertyCode: "BRD-0003",
    title: "Semi furnished 1 BHK on BC Road",
    type: "1 BHK",
    roomType: "1 BHK",
    rent: 9500,
    locality: "BC Road",
    address: "BC Road, Bardhaman, West Bengal",
    lat: 23.2382,
    lng: 87.8602,
    furnishing: "SEMI_FURNISHED" as const,
    preferredTenant: "WORKING_PROFESSIONALS" as const,
    bedrooms: 1,
    bathrooms: 1,
    floor: 3,
    amenities: ["Fan", "Kitchen", "Balcony", "Water", "Electricity", "Parking"]
  },
  {
    propertyCode: "BRD-0004",
    title: "Budget shared room in Khosbagan",
    type: "Shared Room",
    roomType: "Sharing Room",
    rent: 3800,
    locality: "Khosbagan",
    address: "Khosbagan, Bardhaman, West Bengal",
    lat: 23.2297,
    lng: 87.8727,
    furnishing: "SEMI_FURNISHED" as const,
    preferredTenant: "STUDENTS" as const,
    bedrooms: 1,
    bathrooms: 1,
    floor: 1,
    amenities: ["Bed", "Fan", "Water", "Electricity", "Security"]
  },
  {
    propertyCode: "BRD-0005",
    title: "Modern AC room near Perbirhata",
    type: "Single Room",
    roomType: "Single Room",
    rent: 7800,
    locality: "Perbirhata",
    address: "Perbirhata, Bardhaman, West Bengal",
    lat: 23.244,
    lng: 87.8668,
    furnishing: "FURNISHED" as const,
    preferredTenant: "WORKING_PROFESSIONALS" as const,
    bedrooms: 1,
    bathrooms: 1,
    floor: 2,
    amenities: ["WiFi", "Bed", "AC", "Attached Bathroom", "Geyser", "CCTV"]
  },
  {
    propertyCode: "BRD-0006",
    title: "Ground floor family 2 BHK in Birhata",
    type: "2 BHK",
    roomType: "2 BHK",
    rent: 14500,
    locality: "Birhata",
    address: "Birhata, Bardhaman, West Bengal",
    lat: 23.2338,
    lng: 87.879,
    furnishing: "UNFURNISHED" as const,
    preferredTenant: "FAMILY" as const,
    bedrooms: 2,
    bathrooms: 2,
    floor: 0,
    amenities: ["Kitchen", "Parking", "Water", "Electricity", "Balcony"]
  },
  {
    propertyCode: "BRD-0007",
    title: "Clean hostel bed near Railway Station",
    type: "Hostel",
    roomType: "Hostel Bed",
    rent: 4500,
    locality: "Bardhaman Station",
    address: "Near Bardhaman Railway Station, West Bengal",
    lat: 23.2376,
    lng: 87.8694,
    furnishing: "FURNISHED" as const,
    preferredTenant: "STUDENTS" as const,
    bedrooms: 1,
    bathrooms: 1,
    floor: 2,
    amenities: ["Bed", "Fan", "CCTV", "Security", "Water", "Electricity"]
  },
  {
    propertyCode: "BRD-0008",
    title: "Balcony room near University More",
    type: "Single Room",
    roomType: "Single Room",
    rent: 6900,
    locality: "University More",
    address: "University More, Bardhaman, West Bengal",
    lat: 23.2476,
    lng: 87.8515,
    furnishing: "FURNISHED" as const,
    preferredTenant: "ANY" as const,
    bedrooms: 1,
    bathrooms: 1,
    floor: 3,
    amenities: ["WiFi", "Bed", "Fan", "Balcony", "Attached Bathroom", "Water"]
  },
  {
    propertyCode: "BRD-0009",
    title: "Compact room around Tinkonia",
    type: "Single Room",
    roomType: "Single Room",
    rent: 5200,
    locality: "Tinkonia",
    address: "Tinkonia, Bardhaman, West Bengal",
    lat: 23.2292,
    lng: 87.8556,
    furnishing: "SEMI_FURNISHED" as const,
    preferredTenant: "ANY" as const,
    bedrooms: 1,
    bathrooms: 1,
    floor: 1,
    amenities: ["Bed", "Fan", "Water", "Electricity"]
  },
  {
    propertyCode: "BRD-0010",
    title: "Women-friendly PG near Kalna Road",
    type: "PG",
    roomType: "PG Room",
    rent: 7000,
    locality: "Kalna Road",
    address: "Kalna Road, Bardhaman, West Bengal",
    lat: 23.2218,
    lng: 87.8509,
    furnishing: "FURNISHED" as const,
    preferredTenant: "BACHELOR_FEMALE" as const,
    bedrooms: 1,
    bathrooms: 1,
    floor: 2,
    amenities: ["WiFi", "Bed", "CCTV", "Security", "Kitchen", "Water"]
  }
];

type DummyRoom = (typeof rooms)[number];

const localityLandmarks: Record<string, string[]> = {
  "Curzon Gate": ["Curzon Gate", "Bardhaman Town Hall", "BC Road", "Local market"],
  Golapbag: ["University of Burdwan", "Golapbag Campus", "Golapbag More", "Student food stalls"],
  "BC Road": ["BC Road", "Curzon Gate", "Bardhaman Medical College", "Shopping area"],
  Khosbagan: ["Khosbagan Market", "Bardhaman Medical College", "Town bus route", "Local pharmacy"],
  Perbirhata: ["Perbirhata Crossing", "BC Road", "Local transport stand", "Grocery market"],
  Birhata: ["Birhata Market", "Kalna Road connector", "Local school", "Bus route"],
  "Bardhaman Station": ["Bardhaman Railway Station", "Station Road", "Auto stand", "Food market"],
  "University More": ["University More", "University of Burdwan", "Golapbag", "Cycle stand"],
  Tinkonia: ["Tinkonia Bus Stop", "Town market", "Local medicine shop", "Main road"],
  "Kalna Road": ["Kalna Road", "Women-friendly PG zone", "Bus route", "Local market"]
};

const tenantLabel: Record<string, string> = {
  ANY: "students, working professionals, or small families",
  FAMILY: "small families",
  BACHELOR_MALE: "male bachelors",
  BACHELOR_FEMALE: "female students or working professionals",
  STUDENTS: "students",
  WORKING_PROFESSIONALS: "working professionals"
};

const buildRoomDetails = (room: DummyRoom, index: number) => {
  const amenityText = room.amenities.slice(0, 5).join(", ");
  const landmarks = localityLandmarks[room.locality] || [
    "Bardhaman Railway Station",
    "Curzon Gate",
    "Local market",
    "Bus route"
  ];
  const maintenanceCharge = index % 3 === 0 ? 300 : index % 3 === 1 ? 500 : 0;
  const availableFrom = new Date();
  availableFrom.setDate(availableFrom.getDate() + (index % 5));

  return {
    description: `${room.title} is a ${room.furnishing.toLowerCase().replace("_", " ")} ${room.roomType.toLowerCase()} in ${room.locality}, Bardhaman. It is suitable for ${tenantLabel[room.preferredTenant] || "tenants"} and includes practical essentials such as ${amenityText}. The location is convenient for daily travel, food, market access, and quick visits arranged through the middleman. Rent is transparent, owner contact remains private, and customers can ask for more information through WhatsApp before scheduling a visit.`,
    securityDeposit: room.rent,
    maintenanceCharge,
    otherCharges: index % 2 === 0 ? "Electricity as per meter reading" : "No extra charges listed",
    availableFrom,
    totalFloors: room.floor === 0 ? 3 : 4,
    rules: [
      "Valid government ID required before visit",
      "Owner details are handled privately by the middleman",
      room.preferredTenant === "BACHELOR_FEMALE"
        ? "Female tenants preferred"
        : room.preferredTenant === "FAMILY"
          ? "Family tenants preferred"
          : "Quiet residential use expected",
      "One month notice required before vacating"
    ],
    nearbyLandmarks: landmarks
  };
};

const ensureType = async (name: string, index: number) =>
  prisma.propertyType.upsert({
    where: { slug: slug(name) },
    create: { name, slug: slug(name), sortOrder: index + 1 },
    update: { active: true }
  });

const ensureAmenity = async (name: string) =>
  prisma.amenity.upsert({
    where: { slug: slug(name) },
    create: { name, slug: slug(name), icon: slug(name) },
    update: { active: true }
  });

const ensureOwner = async (owner: (typeof owners)[number]) => {
  const existing = await prisma.owner.findFirst({ where: { phone: owner.phone } });
  if (existing) return existing;
  return prisma.owner.create({ data: owner });
};

const main = async () => {
  const typeRows = await Promise.all(propertyTypes.map(ensureType));
  const amenityRows = await Promise.all(amenities.map(ensureAmenity));
  const ownerRows = await Promise.all(owners.map(ensureOwner));

  const typeByName = new Map<string, PropertyType>(typeRows.map((type) => [type.name, type]));
  const amenityByName = new Map<string, Amenity>(amenityRows.map((amenity) => [amenity.name, amenity]));

  let created = 0;
  let updated = 0;

  for (const [index, room] of rooms.entries()) {
    const existing = await prisma.property.findUnique({ where: { propertyCode: room.propertyCode } });
    const selectedAmenities = room.amenities
      .map((name) => amenityByName.get(name)?.id)
      .filter(Boolean) as string[];
    const details = buildRoomDetails(room, index);
    const owner = ownerRows[index % ownerRows.length] as Owner;
    const type = typeByName.get(room.type)!;

    if (existing) {
      await prisma.$transaction(async (tx) => {
        await tx.propertyAmenity.deleteMany({ where: { propertyId: existing.id } });
        await tx.property.update({
          where: { id: existing.id },
          data: {
            title: room.title,
            slug: slug(`${room.title}-${room.propertyCode}`),
            description: details.description,
            propertyTypeId: type.id,
            ownerId: owner.id,
            roomType: room.roomType,
            monthlyRent: room.rent,
            securityDeposit: details.securityDeposit,
            maintenanceCharge: details.maintenanceCharge,
            otherCharges: details.otherCharges,
            address: room.address,
            locality: room.locality,
            city: "Bardhaman",
            state: "West Bengal",
            postalCode: "713101",
            latitude: room.lat,
            longitude: room.lng,
            furnishingStatus: room.furnishing,
            availableFrom: details.availableFrom,
            preferredTenant: room.preferredTenant,
            genderPreference: room.preferredTenant === "BACHELOR_FEMALE" ? "Female preferred" : undefined,
            bedrooms: room.bedrooms,
            bathrooms: room.bathrooms,
            attachedBathroom: room.amenities.includes("Attached Bathroom"),
            floor: room.floor,
            totalFloors: details.totalFloors,
            status: "AVAILABLE",
            featured: index < 4,
            verified: true,
            rules: details.rules,
            nearbyLandmarks: details.nearbyLandmarks,
            amenities: {
              create: selectedAmenities.map((amenityId) => ({
                amenity: { connect: { id: amenityId } }
              }))
            }
          }
        });

        const imageCount = await tx.propertyImage.count({ where: { propertyId: existing.id } });
        if (imageCount === 0) {
          await tx.propertyImage.createMany({
            data: [
              {
                propertyId: existing.id,
                url: "/uploads/room_rent.jpeg",
                alt: room.title,
                isCover: true,
                sortOrder: 0
              },
              {
                propertyId: existing.id,
                url: "/uploads/room_rent.jpeg",
                alt: `${room.title} gallery`,
                isCover: false,
                sortOrder: 1
              }
            ]
          });
        }
      });
      updated += 1;
      continue;
    }

    await prisma.property.create({
      data: {
        propertyCode: room.propertyCode,
        title: room.title,
        slug: slug(`${room.title}-${room.propertyCode}`),
        description: details.description,
        propertyType: { connect: { id: type.id } },
        owner: { connect: { id: owner.id } },
        roomType: room.roomType,
        monthlyRent: room.rent,
        securityDeposit: details.securityDeposit,
        maintenanceCharge: details.maintenanceCharge,
        otherCharges: details.otherCharges,
        address: room.address,
        locality: room.locality,
        city: "Bardhaman",
        state: "West Bengal",
        postalCode: "713101",
        latitude: room.lat,
        longitude: room.lng,
        furnishingStatus: room.furnishing,
        availableFrom: details.availableFrom,
        preferredTenant: room.preferredTenant,
        genderPreference: room.preferredTenant === "BACHELOR_FEMALE" ? "Female preferred" : undefined,
        bedrooms: room.bedrooms,
        bathrooms: room.bathrooms,
        attachedBathroom: room.amenities.includes("Attached Bathroom"),
        floor: room.floor,
        totalFloors: details.totalFloors,
        status: "AVAILABLE",
        featured: index < 4,
        verified: true,
        rules: details.rules,
        nearbyLandmarks: details.nearbyLandmarks,
        images: {
          create: [
            {
              url: "/uploads/room_rent.jpeg",
              alt: room.title,
              isCover: true,
              sortOrder: 0
            },
            {
              url: "/uploads/room_rent.jpeg",
              alt: `${room.title} gallery`,
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
      }
    });

    created += 1;
  }

  await prisma.appSettings.upsert({
    where: { key: "operatingCity" },
    create: { key: "operatingCity", value: "Bardhaman / Burdwan" },
    update: { value: "Bardhaman / Burdwan" }
  });
  await prisma.appSettings.upsert({
    where: { key: "mapCenterLat" },
    create: { key: "mapCenterLat", value: "23.2324" },
    update: { value: "23.2324" }
  });
  await prisma.appSettings.upsert({
    where: { key: "mapCenterLng" },
    create: { key: "mapCenterLng", value: "87.8615" },
    update: { value: "87.8615" }
  });

  console.info(`Dummy room details complete. Created: ${created}. Updated: ${updated}.`);
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
