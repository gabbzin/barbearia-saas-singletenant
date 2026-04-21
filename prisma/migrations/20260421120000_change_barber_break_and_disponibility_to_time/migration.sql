-- AlterTable
ALTER TABLE "BarberBreak"
ALTER COLUMN "startTime" TYPE TIME USING "startTime"::time,
ALTER COLUMN "endTime" TYPE TIME USING "endTime"::time;

-- AlterTable
ALTER TABLE "Disponibility"
ALTER COLUMN "startTime" TYPE TIME USING "startTime"::time,
ALTER COLUMN "endTime" TYPE TIME USING "endTime"::time;
