/*
  Warnings:

  - A unique constraint covering the columns `[barberId,dayOfWeek,startTime,endTime]` on the table `BarberBreak` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[barberId,dayOfWeek,startTime,endTime]` on the table `Disponibility` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Disponibility_barberId_dayOfWeek_key";

-- CreateIndex
CREATE UNIQUE INDEX "BarberBreak_barberId_dayOfWeek_startTime_endTime_key" ON "BarberBreak"("barberId", "dayOfWeek", "startTime", "endTime");

-- CreateIndex
CREATE UNIQUE INDEX "Disponibility_barberId_dayOfWeek_startTime_endTime_key" ON "Disponibility"("barberId", "dayOfWeek", "startTime", "endTime");
