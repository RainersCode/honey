/*
  Warnings:

  - A unique constraint covering the columns `[userFacingId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[resetToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userFacingId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Made the column `paymentMethod` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "deliveryMethod" TEXT NOT NULL DEFAULT 'home';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "userFacingId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "weight" DECIMAL(6,2);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(6),
ALTER COLUMN "paymentMethod" SET NOT NULL,
ALTER COLUMN "paymentMethod" SET DEFAULT 'Stripe';

-- CreateIndex
CREATE UNIQUE INDEX "Order_userFacingId_key" ON "Order"("userFacingId");

-- CreateIndex
CREATE UNIQUE INDEX "User_resetToken_key" ON "User"("resetToken");
