"use server";
import { Hero } from "@/features/landing_page/hero";
import { HowItWork } from "@/features/landing_page/how-it-work";
import { Navbar } from "@/features/landing_page/navbar";
import { ServicesAndPrices } from "@/features/landing_page/services-and-prices";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  const services = await prisma.barberService.findMany({
    distinct: ["name"],
  });

  return (
    <div className="min-h-screen bg-foreground">
      <Navbar />
      <main>
        <Hero services={services} />
        <HowItWork />
        <ServicesAndPrices services={services} />
      </main>
    </div>
  );
}
