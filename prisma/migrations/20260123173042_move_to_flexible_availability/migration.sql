/*
  Warnings:

  - You are about to drop the column `daysOfWeek` on the `Disponibility` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[barberId,dayOfWeek]` on the table `Disponibility` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dayOfWeek` to the `Disponibility` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Disponibility_barberId_key";

-- AlterTable
ALTER TABLE "BarberService" ADD COLUMN     "durationInMinutes" INTEGER NOT NULL DEFAULT 30;

-- AlterTable
ALTER TABLE "Disponibility" DROP COLUMN "daysOfWeek",
ADD COLUMN     "dayOfWeek" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Disponibility_barberId_dayOfWeek_key" ON "Disponibility"("barberId", "dayOfWeek");
