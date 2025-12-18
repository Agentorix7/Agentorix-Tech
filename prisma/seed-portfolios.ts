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

// Static portfolio data from services-portfolio.tsx
const portfolioData = [
  {
    title: "E-commerce Platform Transformation",
    category: "IT Projects",
    type: "Web Development",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    client: "ABC Inc.",
    before: {
      revenue: "$500K",
      conversion: "1.2%",
      traffic: "50K/month"
    },
    after: {
      revenue: "$1.75M",
      conversion: "4.2%",
      traffic: "200K/month"
    },
    metrics: {
      label: "Revenue Increase",
      value: "250%",
      icon: "TrendingUp",
    },
    description: "Complete platform redesign with AI-powered recommendations and seamless checkout experience",
  },
  {
    title: "AI Sales Agent Implementation",
    category: "AI & Automation",
    type: "AI Solutions",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    client: "TechCorp",
    before: {
      leads: "200/month",
      conversion: "5%",
      response: "24 hours"
    },
    after: {
      leads: "800/month",
      conversion: "18%",
      response: "Instant"
    },
    metrics: {
      label: "Lead Conversion",
      value: "180%",
      icon: "Bot",
    },
    description: "Automated lead qualification and meeting scheduling with AI-powered chatbots",
  },
  {
    title: "Multi-Channel Marketing Campaign",
    category: "Marketing Campaigns",
    type: "Digital Marketing",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop",
    client: "BrandX",
    before: {
      roi: "120%",
      cpa: "$150",
      leads: "500/month"
    },
    after: {
      roi: "420%",
      cpa: "$45",
      leads: "2500/month"
    },
    metrics: {
      label: "ROI Improvement",
      value: "320%",
      icon: "Megaphone",
    },
    description: "Comprehensive SEO, PPC, and social media campaign with advanced targeting",
  },
  {
    title: "Cloud Infrastructure Migration",
    category: "IT Projects",
    type: "Cloud Services",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
    client: "Enterprise Solutions",
    before: {
      cost: "$50K/month",
      uptime: "95%",
      scalability: "Limited"
    },
    after: {
      cost: "$27.5K/month",
      uptime: "99.9%",
      scalability: "Unlimited"
    },
    metrics: {
      label: "Cost Reduction",
      value: "45%",
      icon: "TrendingUp",
    },
    description: "Seamless cloud migration with zero downtime and improved scalability",
  },
  {
    title: "Mobile App Development",
    category: "IT Projects",
    type: "App Development",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop",
    client: "StartupXYZ",
    before: {
      users: "5K",
      rating: "3.2/5",
      retention: "25%"
    },
    after: {
      users: "30K",
      rating: "4.8/5",
      retention: "68%"
    },
    metrics: {
      label: "User Growth",
      value: "500%",
      icon: "Users",
    },
    description: "Cross-platform mobile app with native performance and modern UI/UX",
  },
  {
    title: "SEO & Content Strategy Overhaul",
    category: "Marketing Campaigns",
    type: "SEO Services",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    client: "ContentHub",
    before: {
      traffic: "10K/month",
      rankings: "5 top 10",
      leads: "50/month"
    },
    after: {
      traffic: "50K/month",
      rankings: "25 top 10",
      leads: "400/month"
    },
    metrics: {
      label: "Organic Traffic",
      value: "400%",
      icon: "Zap",
    },
    description: "Comprehensive SEO overhaul with content strategy and technical optimization",
  },
  {
    title: "SaaS Platform Development",
    category: "IT Projects",
    type: "SaaS Development",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    client: "CloudSaaS",
    before: {
      users: "1K",
      mrr: "$20K",
      churn: "8%"
    },
    after: {
      users: "15K",
      mrr: "$150K",
      churn: "2%"
    },
    metrics: {
      label: "MRR Growth",
      value: "650%",
      icon: "Code",
    },
    description: "Scalable SaaS platform with automated billing and advanced analytics",
  },
  {
    title: "Lead Generation Campaign",
    category: "Marketing Campaigns",
    type: "Lead Generation",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
    client: "B2B Solutions",
    before: {
      leads: "100/month",
      quality: "30%",
      cost: "$200/lead"
    },
    after: {
      leads: "800/month",
      quality: "75%",
      cost: "$50/lead"
    },
    metrics: {
      label: "Lead Quality",
      value: "150%",
      icon: "Users",
    },
    description: "Targeted B2B lead generation with advanced qualification and nurturing",
  },
  {
    title: "AI Chatbot Implementation",
    category: "AI & Automation",
    type: "AI Solutions",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=600&fit=crop",
    client: "ServicePro",
    before: {
      response: "2 hours",
      satisfaction: "65%",
      cost: "$5K/month"
    },
    after: {
      response: "Instant",
      satisfaction: "92%",
      cost: "$500/month"
    },
    metrics: {
      label: "Cost Savings",
      value: "90%",
      icon: "Bot",
    },
    description: "AI-powered chatbot handling 80% of customer inquiries automatically",
  },
];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

async function main() {
  console.log("🌱 Seeding portfolios from static data...");

  let displayOrder = 1;

  for (const portfolio of portfolioData) {
    try {
      const slug = generateSlug(portfolio.title);
      
      const created = await prisma.portfolio.upsert({
        where: { slug },
        update: {
          title: portfolio.title,
          category: portfolio.category,
          type: portfolio.type,
          image: portfolio.image,
          description: portfolio.description,
          client: portfolio.client,
          metrics: portfolio.metrics || null,
          before: portfolio.before || null,
          after: portfolio.after || null,
          isFeatured: false,
          isActive: true,
          displayOrder: displayOrder,
        },
        create: {
          slug: slug,
          title: portfolio.title,
          category: portfolio.category,
          type: portfolio.type,
          image: portfolio.image,
          description: portfolio.description,
          client: portfolio.client,
          metrics: portfolio.metrics || null,
          before: portfolio.before || null,
          after: portfolio.after || null,
          isFeatured: false,
          isActive: true,
          displayOrder: displayOrder,
        },
      });
      
      console.log(`✅ Seeded portfolio: ${created.title} (${created.slug})`);
      displayOrder++;
    } catch (error: any) {
      console.error(`❌ Error seeding portfolio ${portfolio.title}:`, error.message);
    }
  }

  console.log(`\n🎉 Successfully seeded ${portfolioData.length} portfolios!`);
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

