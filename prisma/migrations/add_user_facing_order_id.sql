-- Add userFacingId column to Order table
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "userFacingId" TEXT UNIQUE; 