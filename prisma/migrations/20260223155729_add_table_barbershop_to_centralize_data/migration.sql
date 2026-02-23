-- CreateTable
CREATE TABLE "Barbershop" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL DEFAULT 'https://3tlh7aktl6.ufs.sh/f/tcFRjMXVSkQ0Asb1IxZDwZ30bIph8P2qjXfOcVJmTvFtnMxi',
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Barbershop_pkey" PRIMARY KEY ("id")
);
