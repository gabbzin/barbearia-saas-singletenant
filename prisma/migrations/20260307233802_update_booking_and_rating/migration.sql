-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "customerName" TEXT,
ADD COLUMN     "customerPhone" TEXT,
ADD COLUMN     "paymentMethod" TEXT;

-- CreateIndex
CREATE INDEX "Booking_customerName_idx" ON "Booking"("customerName");
