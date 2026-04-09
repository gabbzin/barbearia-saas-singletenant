"use server";

import { Portfolio } from "@/features/landing_page/portfolio";
import { Footer } from "@/features/landing_page/footer";
import { Hero } from "@/features/landing_page/hero";
import { HowItWork } from "@/features/landing_page/how-it-work";
import { Navbar } from "@/features/landing_page/navbar";
import { OurTeam } from "@/features/landing_page/our-team";
import { ServicesAndPrices } from "@/features/landing_page/services-and-prices";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  const [services, barber] = await Promise.all([
    await prisma.barberService.findMany({
      distinct: ["name"],
      where: {
        priceInCents: {
          gt: 0.01,
        },
      },
    }),

    await prisma.barber.findFirst({
      where: {
        user: {
          name: "Lucas Alves",
        },
      },
      select: {
        phone: true,
        disponibility: {
          select: {
            dayOfWeek: true,
            startTime: true,
            endTime: true,
          },
          orderBy: {
            dayOfWeek: "asc",
          },
        },
      },
    }),
  ]);

  return (
    <div className="theme-gold min-h-screen scroll-smooth bg-foreground">
      <Navbar />
      <main>
        <Hero services={services} />
        <HowItWork />
        <ServicesAndPrices services={services} />
        <Portfolio />
        <OurTeam />
        <Footer barberInfos={barber} />
      </main>
    </div>
  );
}
