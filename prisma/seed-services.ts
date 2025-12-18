import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { servicesData, additionalServicesData } from "../lib/services-data";
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

async function main() {
  console.log("🌱 Seeding services from lib/services-data.ts...");

  // Seed main services (from servicesData)
  const mainServicesEntries = Object.entries(servicesData);
  let mainServiceOrder = 1;

  for (const [slug, serviceData] of mainServicesEntries) {
    try {
      const service = await prisma.service.upsert({
        where: { slug },
        update: {
          title: serviceData.title,
          shortDescription: serviceData.shortDescription,
          overview: serviceData.overview,
          image: serviceData.image,
          icon: serviceData.icon,
          isMainService: true,
          isActive: true,
          displayOrder: mainServiceOrder,
          sections: serviceData.sections || undefined,
          features: serviceData.features || undefined,
          benefits: serviceData.benefits || undefined,
          useCases: serviceData.useCases || undefined,
          caseStudies: serviceData.caseStudies || undefined,
          pricing: serviceData.pricing || undefined,
          cta: serviceData.cta || undefined,
        },
        create: {
          slug: serviceData.slug,
          title: serviceData.title,
          shortDescription: serviceData.shortDescription,
          overview: serviceData.overview,
          image: serviceData.image,
          icon: serviceData.icon,
          isMainService: true,
          isActive: true,
          displayOrder: mainServiceOrder,
          sections: serviceData.sections || undefined,
          features: serviceData.features || undefined,
          benefits: serviceData.benefits || undefined,
          useCases: serviceData.useCases || undefined,
          caseStudies: serviceData.caseStudies || undefined,
          pricing: serviceData.pricing || undefined,
          cta: serviceData.cta || undefined,
        },
      });
      console.log(`✅ Seeded main service: ${service.title} (${service.slug})`);
      mainServiceOrder++;
    } catch (error: any) {
      console.error(`❌ Error seeding service ${slug}:`, error.message);
    }
  }

  // Seed additional services (from additionalServicesData)
  const additionalServicesEntries = Object.entries(additionalServicesData);
  let additionalServiceOrder = 1;

  for (const [slug, serviceData] of additionalServicesEntries) {
    try {
      // Ensure slug exists in serviceData
      const serviceSlug = serviceData.slug || slug;
      
      // Ensure required fields exist
      if (!serviceData.title) {
        console.warn(`⚠️  Skipping service ${slug}: missing title`);
        continue;
      }

      const service = await prisma.service.upsert({
        where: { slug: serviceSlug },
        update: {
          title: serviceData.title,
          shortDescription: serviceData.shortDescription || serviceData.overview || serviceData.title || "",
          overview: serviceData.overview || serviceData.shortDescription || serviceData.title || "",
          image: serviceData.image || "",
          icon: serviceData.icon || "Settings",
          isMainService: false,
          isActive: true,
          displayOrder: additionalServiceOrder,
          sections: serviceData.sections || undefined,
          features: serviceData.features || undefined,
          benefits: serviceData.benefits || undefined,
          useCases: serviceData.useCases || undefined,
          caseStudies: serviceData.caseStudies || undefined,
          pricing: serviceData.pricing || undefined,
          cta: serviceData.cta || undefined,
        },
        create: {
          slug: serviceSlug,
          title: serviceData.title,
          shortDescription: serviceData.shortDescription || serviceData.overview || serviceData.title || "",
          overview: serviceData.overview || serviceData.shortDescription || serviceData.title || "",
          image: serviceData.image || "",
          icon: serviceData.icon || "Settings",
          isMainService: false,
          isActive: true,
          displayOrder: additionalServiceOrder,
          sections: serviceData.sections || undefined,
          features: serviceData.features || undefined,
          benefits: serviceData.benefits || undefined,
          useCases: serviceData.useCases || undefined,
          caseStudies: serviceData.caseStudies || undefined,
          pricing: serviceData.pricing || undefined,
          cta: serviceData.cta || undefined,
        },
      });
      console.log(`✅ Seeded additional service: ${service.title} (${service.slug})`);
      additionalServiceOrder++;
    } catch (error: any) {
      console.error(`❌ Error seeding additional service ${slug}:`, error.message);
    }
  }

  console.log(`\n🎉 Successfully seeded ${mainServicesEntries.length} main services and ${additionalServicesEntries.length} additional services!`);
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

