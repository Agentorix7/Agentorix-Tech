-- AlterTable
ALTER TABLE "Portfolio" ADD COLUMN     "after" JSONB,
ADD COLUMN     "before" JSONB,
ADD COLUMN     "client" TEXT,
ADD COLUMN     "type" TEXT;
