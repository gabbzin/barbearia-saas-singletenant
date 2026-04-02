/*
  Warnings:

  - A unique constraint covering the columns `[barberId,dayOfWeek]` on the table `Disponibility` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Disponibility_barberId_dayOfWeek_startTime_endTime_key";

-- CreateIndex
CREATE UNIQUE INDEX "Disponibility_barberId_dayOfWeek_key" ON "Disponibility"("barberId", "dayOfWeek");
