  import "dotenv/config";
  import { PrismaClient } from "@prisma/client";
  import { PrismaPg } from "@prisma/adapter-pg";
  import pg from "pg";

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  async function main() {
    const demoUserId = "5b355bbe-882f-4807-9265-db80c739d994";

    // Clear existing data
    await prisma.product.deleteMany({ where: { userId: demoUserId } });

  const gearNames = [
    // Cameras
    "Canon EOS R5", "Canon EOS R6", "Sony A7 IV", "Sony FX6", "Sony A7S III",
    "RED Komodo", "RED Raven", "Blackmagic 6K", "Blackmagic 4K", "Panasonic GH6",
    "Nikon Z8", "Fujifilm X-T5", "Canon C70", "Sony FX3", "ARRI Alexa Mini",
    // Lenses
    "Sigma 24-70mm f/2.8", "Canon 70-200mm f/2.8", "Sony 16-35mm f/2.8",
    "Rokinon 14mm Cine", "Canon 50mm f/1.2", "Sigma 85mm f/1.4", "Zeiss 35mm",
    // Audio
    "Rode NTG3", "Sennheiser MKH 416", "Rode Wireless Go II", "Zoom H6",
    "Tascam DR-40X", "Deity S-Mic 2", "DJI Mic", "Sennheiser G4 Lav Kit",
    // Lighting
    "Aputure 600d", "Aputure 300x", "Godox SL-60W", "Nanlite Forza 500",
    "Aputure MC 4-Light Kit", "Godox VL150", "Litepanels Astra", "Arri SkyPanel",
    // Grip & Support
    "DJI Ronin RS3 Pro", "DJI Ronin RS3", "Tilta Nucleus-M", "Manfrotto 504X",
    "Sachtler FSB-8", "E-Image Tripod", "Slider 4ft", "Dana Dolly",
    // Drones
    "DJI Mavic 3 Pro", "DJI Inspire 3", "DJI Mini 3 Pro", "DJI Avata",
  ];

  const renters = [
    "John Smith", "Jane Doe", "Mike Wilson", "Sarah Lee",
    "Alex Chen", "Emily Brown", "Chris Taylor", "Jordan Davis"
  ];


  await prisma.product.createMany({
    data: gearNames.map((name, i) => {
      const rand = Math.random();
      const isCheckedOut = rand > 0.5 && rand <= 0.75;
      const isOverdue = rand > 0.75;

      return {
        userId: demoUserId,
        name,
        dailyRate: Math.floor(Math.random() * 200) + 25,
        quantity: Math.floor(Math.random() * 3) + 1,
        condition: ["GOOD", "GOOD", "GOOD", "FAIR", "NEEDS_REPAIR"][Math.floor(Math.random() * 5)] as "GOOD" | "FAIR" | "NEEDS_REPAIR",
        checkedOutTo: isCheckedOut || isOverdue ? renters[Math.floor(Math.random() * renters.length)] : null,
        returnDate: isCheckedOut
          ? new Date(Date.now() + Math.floor(Math.random() * 14 + 1) * 24 * 60 * 60 * 1000)
          : isOverdue
          ? new Date(Date.now() - Math.floor(Math.random() * 7 + 1) * 24 * 60 * 60 * 1000)
          : null,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000),
      };
    }),
  });

    console.log("Seed Data created successfully");
    console.log(`Created ${gearNames.length} gear items for User ID: ${demoUserId}`);
  }

  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });