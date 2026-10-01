-- CreateEnum
CREATE TYPE "NavSection" AS ENUM ('learn', 'understand', 'experience');

-- AlterTable
ALTER TABLE "Content" ADD COLUMN "navSection" "NavSection" NOT NULL DEFAULT 'learn';

-- CreateIndex
CREATE INDEX "Content_navSection_isPublished_deletedAt_idx" ON "Content"("navSection", "isPublished", "deletedAt");
