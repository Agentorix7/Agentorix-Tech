import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env file
config({ path: resolve(__dirname, "../.env") });
config({ path: resolve(__dirname, "../.env.local") });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("❌ DATABASE_URL environment variable is not set!");
  console.error("Please check your .env or .env.local file.");
  process.exit(1);
}

console.log("🔗 Database URL:", databaseUrl.replace(/:[^:@]+@/, ":****@")); // Hide password in logs

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Static achievement data from achievements.tsx
const achievementData = [
  {
    type: "ACHIEVEMENT" as const,
    icon: "Trophy",
    title: "Best Digital Agency 2023",
    organization: "Tech Excellence Awards",
    year: "2023",
    description: "Recognized for outstanding innovation in digital transformation",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
  },
  {
    type: "ACHIEVEMENT" as const,
    icon: "Award",
    title: "AI Innovation Award",
    organization: "Global Tech Summit",
    year: "2023",
    description: "Excellence in AI-powered business solutions",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
  },
  {
    type: "ACHIEVEMENT" as const,
    icon: "Star",
    title: "Client Satisfaction Excellence",
    organization: "Industry Leaders",
    year: "2024",
    description: "98% client satisfaction rate across all projects",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop",
  },
];

// Static certification data from achievements.tsx
const certificationData = [
  {
    type: "CERTIFICATION" as const,
    name: "ISO 27001",
    status: "Certified",
    logo: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=100&h=100&fit=crop",
  },
  {
    type: "CERTIFICATION" as const,
    name: "AWS Advanced",
    status: "Partner",
    logo: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    type: "CERTIFICATION" as const,
    name: "Google Cloud",
    status: "Partner",
    logo: "https://images.unsplash.com/photo-1728710718080-3cf64d995d2c?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    type: "CERTIFICATION" as const,
    name: "Microsoft",
    status: "Certified Partner",
    logo: "https://images.unsplash.com/photo-1662947036644-ecfde1221ac7?q=80&w=2128&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    type: "CERTIFICATION" as const,
    name: "HubSpot",
    status: "Certified Agency",
    logo: "https://images.unsplash.com/photo-1602265585142-6b221b9b2c24?q=80&w=1625&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    type: "CERTIFICATION" as const,
    name: "Salesforce",
    status: "Partner",
    logo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=100&fit=crop",
  },
];

async function main() {
  console.log("🌱 Seeding achievements and certifications from static data...");

  let achievementOrder = 1;
  let certificationOrder = 1;

  // Seed achievements
  for (const achievement of achievementData) {
    try {
      // Check if achievement already exists by title
      const existing = await prisma.achievementCertification.findFirst({
        where: {
          type: "ACHIEVEMENT",
          title: achievement.title,
        },
      });

      if (existing) {
        const updated = await prisma.achievementCertification.update({
          where: { id: existing.id },
          data: {
            icon: achievement.icon,
            title: achievement.title,
            organization: achievement.organization,
            year: achievement.year,
            description: achievement.description,
            image: achievement.image,
            isActive: true,
            displayOrder: achievementOrder,
          },
        });
        console.log(`✅ Updated achievement: ${updated.title}`);
      } else {
        const created = await prisma.achievementCertification.create({
          data: {
            type: achievement.type,
            icon: achievement.icon,
            title: achievement.title,
            organization: achievement.organization,
            year: achievement.year,
            description: achievement.description,
            image: achievement.image,
            isActive: true,
            displayOrder: achievementOrder,
          },
        });
        console.log(`✅ Seeded achievement: ${created.title}`);
      }
      achievementOrder++;
    } catch (error: any) {
      console.error(`❌ Error seeding achievement ${achievement.title}:`, error.message);
    }
  }

  // Seed certifications
  for (const certification of certificationData) {
    try {
      // Check if certification already exists by name
      const existing = await prisma.achievementCertification.findFirst({
        where: {
          type: "CERTIFICATION",
          name: certification.name,
        },
      });

      if (existing) {
        const updated = await prisma.achievementCertification.update({
          where: { id: existing.id },
          data: {
            name: certification.name,
            status: certification.status,
            logo: certification.logo,
            isActive: true,
            displayOrder: certificationOrder,
          },
        });
        console.log(`✅ Updated certification: ${updated.name}`);
      } else {
        const created = await prisma.achievementCertification.create({
          data: {
            type: certification.type,
            name: certification.name,
            status: certification.status,
            logo: certification.logo,
            isActive: true,
            displayOrder: certificationOrder,
          },
        });
        console.log(`✅ Seeded certification: ${created.name}`);
      }
      certificationOrder++;
    } catch (error: any) {
      console.error(`❌ Error seeding certification ${certification.name}:`, error.message);
    }
  }

  console.log(`\n🎉 Successfully seeded ${achievementData.length} achievements and ${certificationData.length} certifications!`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

