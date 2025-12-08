/*
  Warnings:

  - Made the column `dailyRate` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
UPDATE "Product" SET "dailyRate" = 0 WHERE "dailyRate" IS NULL;

ALTER TABLE "Product" ALTER COLUMN "dailyRate" SET NOT NULL;
