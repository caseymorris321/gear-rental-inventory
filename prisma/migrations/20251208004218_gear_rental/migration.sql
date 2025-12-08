/*
  Warnings:

  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('GOOD', 'FAIR', 'NEEDS_REPAIR');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "price",
ADD COLUMN     "checkedOutTo" TEXT,
ADD COLUMN     "condition" "Condition" NOT NULL DEFAULT 'GOOD',
ADD COLUMN     "dailyRate" DECIMAL(12,2),
ADD COLUMN     "returnDate" TIMESTAMP(3);
