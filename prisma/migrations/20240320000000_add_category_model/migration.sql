-- CreateTable
CREATE TABLE "Category" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_key_key" ON "Category"("key");

-- Insert initial categories
INSERT INTO "Category" ("key", "name", "description", "image", "updatedAt")
VALUES 
('honey', 'Honey', 'Pure, natural honey with rich flavors and golden hues', 'https://uploadthing.com/f/placeholder-honey.jpg', CURRENT_TIMESTAMP),
('beeswax', 'Beeswax', 'Natural beeswax products for home and wellness', 'https://uploadthing.com/f/placeholder-beeswax.jpg', CURRENT_TIMESTAMP),
('honeycomb', 'Honeycomb', 'Fresh, raw honeycomb straight from the hive', 'https://uploadthing.com/f/placeholder-honeycomb.jpg', CURRENT_TIMESTAMP);

-- AlterTable
ALTER TABLE "Product" 
ADD COLUMN "categoryId" UUID,
DROP COLUMN "category";

-- Update existing products to reference a category (defaulting to honey if no match)
UPDATE "Product" p
SET "categoryId" = (
    SELECT c.id 
    FROM "Category" c 
    WHERE c.key = p.category 
    LIMIT 1
);

-- Add foreign key constraint
ALTER TABLE "Product"
ADD CONSTRAINT "Product_categoryId_fkey" 
FOREIGN KEY ("categoryId") 
REFERENCES "Category"("id") 
ON DELETE RESTRICT ON UPDATE CASCADE; 