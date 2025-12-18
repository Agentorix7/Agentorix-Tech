// Seed script to create the initial admin user.
// Run with: npx prisma db seed

/* eslint-disable @typescript-eslint/no-var-requires */
// Load environment variables from .env file
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });

const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");

// Validate DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error("❌ Error: DATABASE_URL environment variable is not set!");
  console.error("Please set DATABASE_URL in your .env file or environment variables.");
  process.exit(1);
}

// Extract database name from URL for validation
const dbUrl = process.env.DATABASE_URL;
const dbNameMatch = dbUrl.match(/\/\/(?:[^@]+@)?[^\/]+\/([^?]+)/);
const dbName = dbNameMatch ? dbNameMatch[1] : "unknown";

console.log(`🔗 Connecting to database: ${dbName}`);
console.log(`📍 Database URL: ${dbUrl.replace(/:[^:@]+@/, ":****@")}`);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "admin@agentorix.com";
  const plainPassword = "Admin@123";

  const passwordHash = await bcrypt.hash(plainPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      isAdmin: true,
      name: "Admin",
    },
    create: {
      email,
      passwordHash,
      isAdmin: true,
      name: "Admin",
    },
  });

  console.log("✅ Seeded admin user:", {
    id: admin.id,
    email: admin.email,
    isAdmin: admin.isAdmin,
  });
}

main()
  .catch((e) => {
    console.error("❌ Error seeding admin user", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


