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

// Static testimonial data from testimonials.tsx
const testimonialData = [
  {
    name: "Sarah Johnson",
    role: "CEO, TechStart Inc.",
    company: "E-commerce Platform",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    content: `"${process.env.NEXT_PUBLIC_SITE_NAME}" transformed our digital presence completely. Their AI solutions increased our conversion rate by 180% in just 3 months.`,
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Marketing Director",
    company: "SaaS Company",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    content: "The team's expertise in digital marketing is unmatched. We saw a 320% ROI improvement within the first quarter.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "CTO, HealthTech Solutions",
    company: "Healthcare Platform",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    content: "Their cloud migration was seamless with zero downtime. We reduced infrastructure costs by 45% while improving performance.",
    rating: 5,
  },
  {
    name: "David Thompson",
    role: "Founder, RealEstate Pro",
    company: "Real Estate",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    content: `${process.env.NEXT_PUBLIC_SITE_NAME}'s lead generation services brought us qualified leads consistently. Our sales pipeline has never been stronger.`,
    rating: 5,
  },
  {
    name: "Lisa Anderson",
    role: "VP of Operations",
    company: "FinTech Solutions",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop",
    content: `Outstanding service and results. ${process.env.NEXT_PUBLIC_SITE_NAME} helped us streamline operations and reduce costs significantly.`,
    rating: 5,
  },
  {
    name: "James Wilson",
    role: "CEO, RetailMax",
    company: "E-commerce",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
    content: `The AI solutions implemented by ${process.env.NEXT_PUBLIC_SITE_NAME} revolutionized our customer experience and boosted sales by 250%.`,
    rating: 5,
  },
];

async function main() {
  console.log("🌱 Seeding testimonials from static data...");

  let displayOrder = 1;

  for (const testimonial of testimonialData) {
    try {
      // Check if testimonial already exists by name and company
      const existing = await prisma.testimonial.findFirst({
        where: {
          name: testimonial.name,
          company: testimonial.company,
        },
      });

      if (existing) {
        // Update existing testimonial
        const updated = await prisma.testimonial.update({
          where: { id: existing.id },
          data: {
            name: testimonial.name,
            role: testimonial.role,
            company: testimonial.company,
            image: testimonial.image,
            content: testimonial.content,
            rating: testimonial.rating,
            isFeatured: false,
            isActive: true,
            displayOrder: displayOrder,
          },
        });
        console.log(`✅ Updated testimonial: ${updated.name} (${updated.company})`);
      } else {
        // Create new testimonial
        const created = await prisma.testimonial.create({
          data: {
            name: testimonial.name,
            role: testimonial.role,
            company: testimonial.company,
            image: testimonial.image,
            content: testimonial.content,
            rating: testimonial.rating,
            portfolioId: null,
            isFeatured: false,
            isActive: true,
            displayOrder: displayOrder,
          },
        });
        console.log(`✅ Seeded testimonial: ${created.name} (${created.company})`);
      }
      displayOrder++;
    } catch (error: any) {
      console.error(`❌ Error seeding testimonial ${testimonial.name}:`, error.message);
    }
  }

  console.log(`\n🎉 Successfully seeded ${testimonialData.length} testimonials!`);
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

