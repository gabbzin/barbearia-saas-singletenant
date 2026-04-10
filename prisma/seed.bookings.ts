import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env", override: true });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL não encontrada. Verifique o arquivo .env antes de rodar o seed.",
  );
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const lucasEmail = "lucasmatos47@gmail.com";

const seedBookings = [
  { date: new Date(2026, 2, 31, 9, 0, 0), serviceIndex: 0 },
  { date: new Date(2026, 2, 31, 10, 30, 0), serviceIndex: 1 },
  { date: new Date(2026, 3, 1, 9, 0, 0), serviceIndex: 2 },
  { date: new Date(2026, 3, 1, 10, 30, 0), serviceIndex: 3 },
  { date: new Date(2026, 3, 2, 9, 0, 0), serviceIndex: 4 },
  { date: new Date(2026, 3, 2, 10, 30, 0), serviceIndex: 5 },
  { date: new Date(2026, 3, 3, 9, 0, 0), serviceIndex: 6 },
  { date: new Date(2026, 3, 4, 9, 0, 0), serviceIndex: 7 },
  { date: new Date(2026, 3, 5, 9, 0, 0), serviceIndex: 8 },
  { date: new Date(2026, 3, 6, 9, 0, 0), serviceIndex: 9 },
];

async function seedBookingsOnly() {
  const barberUser = await prisma.user.findUnique({
    where: {
      email: lucasEmail,
    },
  });

  if (!barberUser) {
    throw new Error(
      "Barbeiro base não encontrado. Execute o seed principal primeiro.",
    );
  }

  const barber = await prisma.barber.findUnique({
    where: {
      userId: barberUser.id,
    },
    include: {
      services: true,
    },
  });

  if (!barber || barber.services.length === 0) {
    throw new Error("Serviços base não encontrados para o barbeiro.");
  }

  const clientUser = await prisma.user.upsert({
    where: {
      email: "joaosilva@gmail.com",
    },
    update: {
      name: "João Silva",
      role: "USER",
    },
    create: {
      name: "João Silva",
      email: "joaosilva@gmail.com",
      role: "USER",
    },
  });

  await prisma.booking.deleteMany({
    where: {
      barberId: barber.id,
      customerName: {
        startsWith: "Seed gráfico",
      },
    },
  });

  for (const [index, booking] of seedBookings.entries()) {
    const service =
      barber.services[booking.serviceIndex % barber.services.length];

    await prisma.booking.create({
      data: {
        date: booking.date,
        status: "COMPLETED",
        userId: clientUser.id,
        barberId: barber.id,
        serviceId: service.id,
        paidWithSubscription: false,
        priceInCents: service.priceInCents,
        customerName: `Seed gráfico ${String(index + 1).padStart(2, "0")}`,
        customerPhone: "(00) 00000-0000",
        paymentMethod: "seed",
      },
    });
  }

  console.log("✅ 10 agendamentos criados com sucesso!");

  await prisma.$disconnect();
}

seedBookingsOnly().catch(async error => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
