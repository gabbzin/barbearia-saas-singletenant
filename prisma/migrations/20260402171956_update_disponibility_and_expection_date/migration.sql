/*
  Warnings:

  - The `startTime` column on the `ExceptionDate` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `endTime` column on the `ExceptionDate` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[barberId,dayOfWeek]` on the table `Disponibility` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Disponibility_barberId_dayOfWeek_startTime_endTime_key";

-- AlterTable
ALTER TABLE "ExceptionDate" DROP COLUMN "startTime",
ADD COLUMN     "startTime" TIME,
DROP COLUMN "endTime",
ADD COLUMN     "endTime" TIME;

-- CreateIndex
CREATE UNIQUE INDEX "Disponibility_barberId_dayOfWeek_key" ON "Disponibility"("barberId", "dayOfWeek");
