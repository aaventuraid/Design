-- CreateEnum
CREATE TYPE "public"."SiteContentType" AS ENUM ('TEXT', 'HTML', 'URL', 'IMAGE', 'JSON');

-- CreateTable
CREATE TABLE "public"."site_contents" (
    "id" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "valueType" "public"."SiteContentType" NOT NULL DEFAULT 'TEXT',
    "label" TEXT,
    "description" TEXT,
    "category" TEXT,
    "sortOrder" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_contents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "site_contents_section_key_key" ON "public"."site_contents"("section", "key");
