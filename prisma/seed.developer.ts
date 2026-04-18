import { auth } from "@/lib/auth";
import { GHOST_USER_ID } from "@/lib/consts";
import { prisma } from "@/lib/prisma";

type SeedUserInput = {
  name: string;
  email: string;
  password: string;
  image?: string;
  role?: "USER" | "BARBER" | "ADMIN";
};

const barberNames = ["Dominic", "Bryan", "Julius", "Leo Barber"];

const services = [
  {
    name: "Corte de Cabelo",
    description: "Estilo personalizado com as últimas tendências.",
    priceInCents: 3500,
    imageUrl:
      "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png",
  },
  {
    name: "Barba",
    description: "Modelagem completa para destacar sua masculinidade.",
    priceInCents: 3000,
    imageUrl:
      "https://utfs.io/f/e6bdffb6-24a9-455b-aba3-903c2c2b5bde-1jo6tu.png",
  },
  {
    name: "Pézinho",
    description: "Acabamento perfeito para um visual renovado.",
    priceInCents: 3500,
    imageUrl:
      "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
  },
  {
    name: "Sobrancelha",
    description: "Expressão acentuada com modelagem precisa.",
    priceInCents: 1000,
    imageUrl:
      "https://utfs.io/f/2118f76e-89e4-43e6-87c9-8f157500c333-b0ps0b.png",
  },
  {
    name: "Massagem",
    description: "Relaxe com uma massagem revigorante.",
    priceInCents: 5000,
    imageUrl:
      "https://utfs.io/f/c4919193-a675-4c47-9f21-ebd86d1c8e6a-4oen2a.png",
  },
  {
    name: "Hidratação",
    description: "Hidratação profunda para cabelo e barba.",
    priceInCents: 2500,
    imageUrl:
      "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
  },
  {
    name: "Platinado + Corte",
    description: "Hidratação profunda para cabelo e barba.",
    priceInCents: 12000,
    imageUrl:
      "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
  },
  {
    name: "Luzes + Corte",
    description: "Hidratação profunda para cabelo e barba.",
    priceInCents: 10000,
    imageUrl:
      "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
  },
];

const plans = [
  {
    id: "plano-1",
    name: "Hair",
    description: "Cortes de cabelo ilimitados por mês",
    priceInCents: 8000,
    stripePriceId: "price_1Sf3aPLZmTtv3cllAd2ewhDQ",
    benefits: [
      "Cortes ilimitados",
      "Agendamento prioritário",
      "Descontos exclusivos",
    ],
  },
  {
    id: "plano-2",
    name: "Beard",
    description: "Serviços de barba ilimitados por mês",
    priceInCents: 7000,
    stripePriceId: "price_1SfJCWLZmTtv3cllEvJ1kLV8",
    benefits: [
      "Barba ilimitada",
      "Agendamento prioritário",
      "Descontos exclusivos",
    ],
  },
  {
    id: "plano-3",
    name: "Hair and Beard",
    description: "Cortes e barba ilimitados por mês",
    priceInCents: 15000,
    stripePriceId: "price_1SfJCmLZmTtv3cllXAzpWq1a",
    benefits: [
      "Cortes e barba ilimitados",
      "Agendamento prioritário",
      "Acesso a promoções",
    ],
  },
  {
    id: "plano-4",
    name: "FREE",
    description: "Plano gratuito com serviços limitados",
    priceInCents: 0,
    stripePriceId: null,
    benefits: ["Acesso limitado aos serviços", "Suporte padrão"],
  },
];

async function signUpOrGetUser(input: SeedUserInput) {
  try {
    const result = await auth.api.signUpEmail({
      body: {
        name: input.name,
        email: input.email,
        password: input.password,
        image: input.image,
        role: input.role,
      },
    });

    return result.user;
  } catch (error) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      return existingUser;
    }

    throw error;
  }
}

async function seedDatabase() {
  try {
    const barbershop = await prisma.barbershop.upsert({
      where: {
        id: "default",
      },
      update: {
        name: "Barbearia do Zé",
        address: "Rua dos Barbeiros, 123",
        imageUrl:
          "https://tp9a32tu7d1qyqaz.public.blob.vercel-storage.com/templates-assets/logo.png",
        storageUrl: "https://tp9a32tu7d1qyqaz.public.blob.vercel-storage.com",
      },
      create: {
        id: "default",
        name: "Barbearia do Zé",
        address: "Rua dos Barbeiros, 123",
        imageUrl:
          "https://tp9a32tu7d1qyqaz.public.blob.vercel-storage.com/templates-assets/logo.png",
        storageUrl: "https://tp9a32tu7d1qyqaz.public.blob.vercel-storage.com",
      },
    });

    await prisma.user.upsert({
      where: {
        id: GHOST_USER_ID,
      },
      update: {
        name: "Ghost User",
        email: "ghost@gmail.com",
      },
      create: {
        id: GHOST_USER_ID,
        name: "Ghost User",
        email: "ghost@gmail.com",
      },
    });

    for (const plan of plans) {
      await prisma.plan.upsert({
        where: {
          id: plan.id,
        },
        update: {
          name: plan.name,
          description: plan.description,
          priceInCents: plan.priceInCents,
          stripePriceId: plan.stripePriceId,
          benefits: plan.benefits,
        },
        create: plan,
      });
    }

    const barbers = [] as { id: string }[];

    for (let i = 0; i < barberNames.length; i++) {
      const name = barberNames[i];
      const imageUrl =
        "https://tp9a32tu7d1qyqaz.public.blob.vercel-storage.com/templates-assets/barbeiro_default.png";
      const email = `${name.toLowerCase().replace(/ /g, ".")}@barber.com`;

      const user = await signUpOrGetUser({
        name,
        email,
        password: "Senha123#",
        image: imageUrl,
        role: "BARBER",
      });

      const barber = await prisma.barber.upsert({
        where: {
          userId: user.id,
        },
        update: {
          phone: "(11) 99999-9999",
        },
        create: {
          phone: "(11) 99999-9999",
          userId: user.id,
        },
      });

      await prisma.barberService.deleteMany({
        where: {
          barberId: barber.id,
        },
      });

      for (const service of services) {
        await prisma.barberService.create({
          data: {
            name: service.name,
            description: service.description,
            priceInCents: service.priceInCents,
            durationInMinutes: 30,
            barber: {
              connect: {
                id: barber.id,
              },
            },
            imageUrl: service.imageUrl,
          },
        });
      }

      barbers.push({ id: barber.id });
    }

    const clientUser = await signUpOrGetUser({
      name: "João Silva",
      email: "joaosilva@gmail.com",
      password: "Senha123#",
      role: "USER",
    });

    const firstBarber = barbers[0];

    if (!firstBarber) {
      throw new Error("Nenhum barbeiro foi criado no seed.");
    }

    const barberServices = await prisma.barberService.findMany({
      where: { barberId: firstBarber.id },
      take: 4,
    });

    if (barberServices.length === 0) {
      throw new Error("Nenhum serviço encontrado para o barbeiro seed.");
    }

    const pastDates = [
      new Date("2024-11-01T10:00:00Z"),
      new Date("2024-11-05T14:00:00Z"),
      new Date("2024-11-12T16:00:00Z"),
      new Date("2024-11-18T11:00:00Z"),
      new Date("2024-11-22T15:00:00Z"),
      new Date("2024-11-28T09:00:00Z"),
    ];

    await prisma.booking.deleteMany({
      where: {
        barberId: firstBarber.id,
        customerName: {
          startsWith: "Seed dev",
        },
      },
    });

    for (let i = 0; i < pastDates.length; i++) {
      const service = barberServices[i % barberServices.length];

      await prisma.booking.create({
        data: {
          date: pastDates[i],
          status: "COMPLETED",
          userId: clientUser.id,
          barberId: firstBarber.id,
          services: {
            connect: [{ id: service.id }],
          },
          paidWithSubscription: false,
          priceInCents: service.priceInCents,
          customerName: `Seed dev ${String(i + 1).padStart(2, "0")}`,
          customerPhone: "(11) 90000-0000",
          paymentMethod: "seed",
        },
      });
    }

    const startTime = "09:00";
    const endTime = "21:00";

    for (const barber of barbers) {
      for (let day = 1; day <= 5; day++) {
        await prisma.disponibility.upsert({
          where: {
            barberId_dayOfWeek: {
              barberId: barber.id,
              dayOfWeek: day,
            },
          },
          update: {
            startTime: startTime,
            endTime: endTime,
          },
          create: {
            barberId: barber.id,
            dayOfWeek: day,
            startTime: startTime,
            endTime: endTime,
          },
        });
      }
    }

    console.log("✅ Seed concluído com sucesso!");
    console.log(`- Barbearia: ${barbershop.name} (${barbershop.id})`);
    console.log(`- ${barbers.length} barbeiros criados`);
    console.log(`- ${pastDates.length} agendamentos passados criados`);
    console.log(`- ${plans.length} planos criados`);
    console.log(
      `- Configurações de disponibilidade criadas para cada barbeiro iniciando as ${startTime} até ${endTime} de segunda a sexta.`,
    );
  } catch (error) {
    console.error("Erro ao criar as barbearias:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
