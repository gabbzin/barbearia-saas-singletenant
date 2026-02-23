/*
  Warnings:

  - Added the required column `storageUrl` to the `Barbershop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Barbershop" ADD COLUMN     "storageUrl" TEXT NOT NULL;
