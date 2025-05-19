-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "isShipped" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shippedAt" TIMESTAMP(6);
