-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_sequence START 1 INCREMENT 1 MINVALUE 1 MAXVALUE 9999 CYCLE;

-- Add userFacingId column to Order table without default value first
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "userFacingId" TEXT UNIQUE;

-- Update existing orders with a userFacingId
UPDATE "Order" 
SET "userFacingId" = 'ORD-' || TO_CHAR("createdAt", 'YYYYMMDD') || '-' || TO_CHAR(nextval('order_sequence'), 'FM0000')
WHERE "userFacingId" IS NULL;

-- Now set the default value
ALTER TABLE "Order" ALTER COLUMN "userFacingId" SET DEFAULT 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || TO_CHAR(nextval('order_sequence'), 'FM0000'); 