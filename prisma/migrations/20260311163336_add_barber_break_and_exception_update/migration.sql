/*
  Warnings:

  - You are about to drop the column `isClosed` on the `ExceptionDate` table. All the data in the column will be lost.
  - Added the required column `date` to the `ExceptionDate` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ExceptionDate_barberId_idx";

-- AlterTable
ALTER TABLE "Barber" ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "phone" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ExceptionDate" DROP COLUMN "isClosed",
ADD COLUMN     "isClosedFullTime" BOOLEAN NOT NULL DEFAULT true,
DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Rating" ADD COLUMN     "asked" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "DiaSemana";

-- CreateTable
CREATE TABLE "BarberBreak" (
    "id" TEXT NOT NULL,
    "barberId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,

    CONSTRAINT "BarberBreak_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BarberBreak_barberId_dayOfWeek_idx" ON "BarberBreak"("barberId", "dayOfWeek");

-- CreateIndex
CREATE INDEX "ExceptionDate_barberId_date_idx" ON "ExceptionDate"("barberId", "date");

-- AddForeignKey
ALTER TABLE "BarberBreak" ADD CONSTRAINT "BarberBreak_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "Barber"("id") ON DELETE CASCADE ON UPDATE CASCADE;
