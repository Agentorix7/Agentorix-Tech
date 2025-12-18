import "dotenv/config"; // Load environment variables
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Static industries data from services-industries.tsx
const industriesData = [
  {
    name: "E-commerce",
    slug: "e-commerce",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    description: "Digital commerce solutions for online retailers",
    painPoints: [
      "Low conversion rates and cart abandonment",
      "Poor inventory management",
      "Limited payment gateway options",
      "Inefficient order fulfillment",
      "Weak customer retention strategies"
    ],
    solutions: [
      "AI-powered product recommendations",
      "Integrated inventory management systems",
      "Multi-payment gateway integration",
      "Automated order processing",
      "Personalized marketing automation"
    ],
    caseStudy: {
      title: "ABC Inc. E-commerce Platform",
      result: "250% revenue increase in 6 months",
      description: "Complete platform redesign with AI recommendations and seamless checkout"
    }
  },
  {
    name: "Real Estate",
    slug: "real-estate",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
    description: "Property management and real estate technology solutions",
    painPoints: [
      "Manual property listing management",
      "Inefficient lead tracking",
      "Poor client communication",
      "Time-consuming document processing",
      "Limited virtual tour capabilities"
    ],
    solutions: [
      "Automated property listing platforms",
      "CRM integration for lead management",
      "AI-powered chatbots for inquiries",
      "Document automation systems",
      "360° virtual tour integration"
    ],
    caseStudy: {
      title: "XYZ Realty CRM System",
      result: "180% increase in qualified leads",
      description: "Custom CRM with automated workflows and virtual tour integration"
    }
  },
  {
    name: "Travel & Tourism",
    slug: "travel-tourism",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop",
    description: "Travel booking and tourism management platforms",
    painPoints: [
      "Complex booking management",
      "Poor customer support response times",
      "Limited mobile accessibility",
      "Inefficient payment processing",
      "Difficulty managing multiple vendors"
    ],
    solutions: [
      "Integrated booking platforms",
      "AI chatbots for 24/7 support",
      "Mobile-first travel apps",
      "Multi-currency payment systems",
      "Vendor management portals"
    ],
    caseStudy: {
      title: "TravelHub Booking Platform",
      result: "320% increase in bookings",
      description: "Complete booking system with AI recommendations and mobile app"
    }
  },
  {
    name: "Healthcare",
    slug: "healthcare",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
    description: "Healthcare technology and patient management solutions",
    painPoints: [
      "Manual patient record management",
      "Long appointment wait times",
      "HIPAA compliance challenges",
      "Inefficient billing processes",
      "Limited telemedicine capabilities"
    ],
    solutions: [
      "Electronic Health Records (EHR) systems",
      "Automated appointment scheduling",
      "HIPAA-compliant cloud solutions",
      "Automated billing and invoicing",
      "Telemedicine platform integration"
    ],
    caseStudy: {
      title: "MedCare Patient Portal",
      result: "60% reduction in admin time",
      description: "HIPAA-compliant patient management system with telemedicine"
    }
  },
  {
    name: "FinTech",
    slug: "fintech",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    description: "Financial technology and payment solutions",
    painPoints: [
      "Security and fraud concerns",
      "Regulatory compliance complexity",
      "Slow transaction processing",
      "Poor user experience",
      "Limited integration capabilities"
    ],
    solutions: [
      "Advanced fraud detection systems",
      "Regulatory compliance automation",
      "High-performance payment processing",
      "Intuitive mobile banking apps",
      "API-first architecture"
    ],
    caseStudy: {
      title: "PaySecure Payment Platform",
      result: "99.9% uptime with zero fraud incidents",
      description: "Secure payment gateway with real-time fraud detection"
    }
  },
  {
    name: "Logistics & Transport",
    slug: "logistics-transport",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop",
    description: "Logistics and transportation management systems",
    painPoints: [
      "Inefficient route planning",
      "Poor real-time tracking",
      "Manual inventory management",
      "Limited visibility into operations",
      "High operational costs"
    ],
    solutions: [
      "AI-powered route optimization",
      "Real-time GPS tracking systems",
      "Automated warehouse management",
      "Comprehensive analytics dashboards",
      "Cost optimization algorithms"
    ],
    caseStudy: {
      title: "LogiTrack Fleet Management",
      result: "35% reduction in fuel costs",
      description: "Complete logistics platform with route optimization and tracking"
    }
  },
  {
    name: "Education & E-learning",
    slug: "education-elearning",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
    description: "Educational technology and e-learning platforms",
    painPoints: [
      "Outdated learning management systems",
      "Poor student engagement",
      "Limited assessment tools",
      "Inefficient content delivery",
      "Difficulty tracking progress"
    ],
    solutions: [
      "Modern LMS platforms",
      "Interactive learning modules",
      "Automated assessment systems",
      "Video streaming and content delivery",
      "Comprehensive progress analytics"
    ],
    caseStudy: {
      title: "EduLearn Platform",
      result: "400% increase in student engagement",
      description: "Interactive learning platform with AI-powered personalization"
    }
  },
  {
    name: "SaaS Companies",
    slug: "saas-companies",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    description: "Software as a Service platform solutions",
    painPoints: [
      "Scalability challenges",
      "Complex subscription management",
      "Limited API capabilities",
      "Poor user onboarding",
      "Insufficient analytics"
    ],
    solutions: [
      "Cloud-native architecture",
      "Automated subscription billing",
      "Comprehensive API development",
      "Interactive onboarding flows",
      "Advanced analytics and reporting"
    ],
    caseStudy: {
      title: "CloudSaaS Platform",
      result: "500% user growth in 12 months",
      description: "Scalable SaaS platform with automated billing and analytics"
    }
  },
  {
    name: "Hospitality & Restaurants",
    slug: "hospitality-restaurants",
    image: "https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=800&h=600&fit=crop",
    description: "Hospitality and restaurant management solutions",
    painPoints: [
      "Manual reservation management",
      "Poor guest experience",
      "Inefficient POS systems",
      "Limited loyalty program capabilities",
      "Difficulty managing multiple locations"
    ],
    solutions: [
      "Automated reservation systems",
      "Guest management platforms",
      "Integrated POS solutions",
      "Loyalty program automation",
      "Multi-location management dashboards"
    ],
    caseStudy: {
      title: "HotelPro Management System",
      result: "45% increase in repeat bookings",
      description: "Complete hospitality management with guest engagement tools"
    }
  },
  {
    name: "Professional Services",
    slug: "professional-services",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop",
    description: "Professional services management and automation",
    painPoints: [
      "Manual client management",
      "Time tracking inefficiencies",
      "Complex billing processes",
      "Poor project visibility",
      "Limited collaboration tools"
    ],
    solutions: [
      "Client relationship management systems",
      "Automated time tracking",
      "Streamlined billing and invoicing",
      "Project management dashboards",
      "Collaboration and communication tools"
    ],
    caseStudy: {
      title: "ProManage CRM",
      result: "50% reduction in administrative overhead",
      description: "Comprehensive CRM for professional services with automation"
    }
  },
  {
    name: "Automotive",
    slug: "automotive",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop",
    description: "Automotive dealership and service management",
    painPoints: [
      "Outdated inventory systems",
      "Poor customer service",
      "Limited online presence",
      "Inefficient service scheduling",
      "Difficulty managing parts inventory"
    ],
    solutions: [
      "Modern inventory management",
      "AI-powered customer support",
      "E-commerce platforms",
      "Automated service scheduling",
      "Parts tracking and management"
    ],
    caseStudy: {
      title: "AutoDealer Platform",
      result: "200% increase in online sales",
      description: "Complete automotive dealership management system"
    }
  },
];

async function main() {
  console.log("🔗 Database URL:", process.env.DATABASE_URL?.replace(/postgres:([^@]+)@/, "postgres:****@"));
  console.log("🌱 Seeding industries from static data...");

  let order = 1;

  for (const industryData of industriesData) {
    try {
      const industry = await prisma.industry.upsert({
        where: { slug: industryData.slug },
        update: {
          name: industryData.name,
          description: industryData.description,
          image: industryData.image,
          isActive: true,
          displayOrder: order,
          services: {
            painPoints: industryData.painPoints,
            solutions: industryData.solutions,
            caseStudy: industryData.caseStudy,
          },
        },
        create: {
          slug: industryData.slug,
          name: industryData.name,
          description: industryData.description,
          image: industryData.image,
          isActive: true,
          displayOrder: order,
          services: {
            painPoints: industryData.painPoints,
            solutions: industryData.solutions,
            caseStudy: industryData.caseStudy,
          },
        },
      });
      console.log(`✅ Seeded industry: ${industry.name} (${industry.slug})`);
      order++;
    } catch (error: any) {
      console.error(`❌ Error seeding industry ${industryData.slug}:`, error.message);
    }
  }

  console.log(`\n🎉 Successfully seeded ${industriesData.length} industries!`);
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

