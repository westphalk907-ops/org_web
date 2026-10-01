-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('super_admin', 'admin', 'editor');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('insight', 'research', 'framework', 'playbook', 'case', 'checklist', 'tool', 'prompt', 'skill', 'workflow', 'whitepaper');

-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('pdf', 'md', 'link', 'notion', 'zip');

-- CreateEnum
CREATE TYPE "Topic" AS ENUM ('individual', 'workflow', 'team', 'organization', 'governance');

-- CreateEnum
CREATE TYPE "Audience" AS ENUM ('ceo', 'hr', 'business', 'it', 'manager');

-- CreateEnum
CREATE TYPE "ContentCategory" AS ENUM ('insight', 'trend', 'point_of_view', 'field_note', 'research', 'whitepaper', 'playbook', 'framework');

-- CreateEnum
CREATE TYPE "ScenarioCategory" AS ENUM ('INDIVIDUAL', 'TEAM', 'SALES', 'MARKETING', 'HR', 'SERVICE', 'MANAGEMENT');

-- CreateEnum
CREATE TYPE "ExperienceKind" AS ENUM ('INDIVIDUAL', 'ORGANIZATION', 'WORKFLOW');

-- CreateEnum
CREATE TYPE "Dimension" AS ENUM ('STRATEGY', 'PEOPLE', 'WORKFLOW', 'TECHNOLOGY', 'DATA', 'GOVERNANCE', 'ORGANIZATION');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'editor',
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "ResourceType" NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "summary" TEXT NOT NULL,
    "thumbnail" TEXT,
    "author" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tags" TEXT[],
    "topic" "Topic",
    "audience" "Audience"[],
    "industry" TEXT[],
    "relatedServices" TEXT[],
    "fileUrl" TEXT,
    "fileType" "FileType" NOT NULL,
    "fileName" TEXT,
    "fileSize" TEXT,
    "pages" INTEGER,
    "cover" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Content" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" "ContentCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "excerpt" TEXT NOT NULL,
    "cover" TEXT,
    "content" TEXT NOT NULL,
    "contentHtml" TEXT NOT NULL,
    "author" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readingTime" INTEGER,
    "tags" TEXT[],
    "relatedIds" TEXT[],
    "index" TEXT,
    "nodeSlug" TEXT,
    "sourceUrl" TEXT,
    "sourcePlatform" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedBy" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Case" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "scale" TEXT,
    "title" TEXT NOT NULL,
    "before" TEXT NOT NULL,
    "intervention" TEXT NOT NULL,
    "after" TEXT NOT NULL,
    "next" TEXT,
    "metrics" JSONB,
    "testimonial" JSONB,
    "coverImage" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeConfig" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "HomeConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentSubmission" (
    "id" TEXT NOT NULL,
    "userAgent" TEXT,
    "ip" TEXT,
    "answers" JSONB NOT NULL,
    "result" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssessmentSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scenario" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" "ScenarioCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "heroDesc" TEXT,
    "icon" TEXT,
    "problem" TEXT NOT NULL,
    "beforeSteps" TEXT[],
    "afterSteps" TEXT[],
    "prompts" TEXT[],
    "resourceSlugs" TEXT[],
    "ownerContactEnabled" BOOLEAN NOT NULL DEFAULT true,
    "tags" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Scenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperienceMap" (
    "id" TEXT NOT NULL,
    "kind" "ExperienceKind" NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "heroDesc" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ExperienceMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperienceStage" (
    "id" TEXT NOT NULL,
    "mapId" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "characteristics" TEXT[],
    "painPoints" TEXT[],
    "actions" TEXT[],
    "resourceSlugs" TEXT[],
    "serviceLinks" JSONB,
    "details" JSONB,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExperienceStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentQuestion" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "dimension" "Dimension" NOT NULL,
    "text" TEXT NOT NULL,
    "description" TEXT,
    "options" JSONB NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "stage" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssessmentQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Resource_slug_key" ON "Resource"("slug");

-- CreateIndex
CREATE INDEX "Resource_type_deletedAt_idx" ON "Resource"("type", "deletedAt");

-- CreateIndex
CREATE INDEX "Resource_publishedAt_idx" ON "Resource"("publishedAt");

-- CreateIndex
CREATE INDEX "Resource_isFeatured_sortOrder_idx" ON "Resource"("isFeatured", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Content_slug_key" ON "Content"("slug");

-- CreateIndex
CREATE INDEX "Content_category_isPublished_deletedAt_idx" ON "Content"("category", "isPublished", "deletedAt");

-- CreateIndex
CREATE INDEX "Content_publishedAt_idx" ON "Content"("publishedAt");

-- CreateIndex
CREATE INDEX "Content_nodeSlug_idx" ON "Content"("nodeSlug");

-- CreateIndex
CREATE UNIQUE INDEX "Case_slug_key" ON "Case"("slug");

-- CreateIndex
CREATE INDEX "Case_isPublished_deletedAt_sortOrder_idx" ON "Case"("isPublished", "deletedAt", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "HomeConfig_key_key" ON "HomeConfig"("key");

-- CreateIndex
CREATE INDEX "AssessmentSubmission_createdAt_idx" ON "AssessmentSubmission"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Scenario_slug_key" ON "Scenario"("slug");

-- CreateIndex
CREATE INDEX "Scenario_category_isActive_deletedAt_sortOrder_idx" ON "Scenario"("category", "isActive", "deletedAt", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ExperienceMap_slug_key" ON "ExperienceMap"("slug");

-- CreateIndex
CREATE INDEX "ExperienceMap_kind_isActive_deletedAt_idx" ON "ExperienceMap"("kind", "isActive", "deletedAt");

-- CreateIndex
CREATE INDEX "ExperienceStage_mapId_sortOrder_idx" ON "ExperienceStage"("mapId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentQuestion_slug_key" ON "AssessmentQuestion"("slug");

-- CreateIndex
CREATE INDEX "AssessmentQuestion_dimension_isActive_sortOrder_idx" ON "AssessmentQuestion"("dimension", "isActive", "sortOrder");

-- AddForeignKey
ALTER TABLE "ExperienceStage" ADD CONSTRAINT "ExperienceStage_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "ExperienceMap"("id") ON DELETE CASCADE ON UPDATE CASCADE;
