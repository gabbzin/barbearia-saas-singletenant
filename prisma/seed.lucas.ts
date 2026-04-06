import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { imagePaths } from "@/shared/constants/images";

type LucasService = {
  name: string;
  durationInMinutes: number;
  priceInCents: number;
  description: string;
};

const lucasServices: LucasService[] = [
  {
    name: "Degradê",
    durationInMinutes: 20,
    priceInCents: 3000,
    description: "Corte moderno com graduação",
  },
  {
    name: "Degradê e tesoura",
    durationInMinutes: 30,
    priceInCents: 3000,
    description: "Acabamento super na tesoura",
  },
  {
    name: "Navalhado",
    durationInMinutes: 30,
    priceInCents: 3000,
    description: "Acabamento clássico na tesoura",
  },
  {
    name: "Barba",
    durationInMinutes: 25,
    priceInCents: 2500,
    description: "Aparo e desenho de barba",
  },
  {
    name: "Sobrancelha",
    durationInMinutes: 30,
    priceInCents: 2500,
    description: "Limpeza e design",
  },
  {
    name: "Selagem",
    durationInMinutes: 180,
    priceInCents: 15000,
    description: "Alinhamento térmico",
  },
  {
    name: "Progressiva",
    durationInMinutes: 120,
    priceInCents: 15000,
    description: "Alisamento capilar",
  },
  {
    name: "Manicure",
    durationInMinutes: 60,
    priceInCents: 6000,
    description: "Cuidado completo nas unhas",
  },
  {
    name: "Cronograma capilar",
    durationInMinutes: 30,
    priceInCents: 16000,
    description: "Hidratação, Nutrição e Construção",
  },
  {
    name: "Terapia capilar",
    durationInMinutes: 40,
    priceInCents: 0,
    description: "Tratamento do couro cabeludo",
  },
  {
    name: "Escova / Chapinha",
    durationInMinutes: 45,
    priceInCents: 6000,
    description: "Finalização e modelagem",
  },
  {
    name: "Tintura / Luzes / Platinado",
    durationInMinutes: 240,
    priceInCents: 0,
    description: "Procedimentos quimicos de cor",
  },
];

const lucasWorkingDays = [
  { dayOfWeek: 1, startTime: "08:00", endTime: "19:00" },
  { dayOfWeek: 2, startTime: "08:00", endTime: "19:00" },
  { dayOfWeek: 3, startTime: "08:00", endTime: "19:00" },
  { dayOfWeek: 4, startTime: "08:00", endTime: "19:00" },
  { dayOfWeek: 5, startTime: "08:00", endTime: "19:00" },
  { dayOfWeek: 6, startTime: "08:00", endTime: "19:00" },
];

async function seedLucasBarbershop() {
  await prisma.plan.upsert({
    where: {
      id: "plano-4",
    },
    update: {},
    create: {
      id: "plano-4",
      name: "FREE",
      description: "Plano gratuito com serviços limitados",
      priceInCents: 0,
      benefits: ["Acesso limitado aos serviços", "Suporte padrão"],
    },
  });

  const barbershop = await prisma.barbershop.create({
    data: {
      name: "Lucas Alves Salão e Barbearia",
      address: "Endereço não informado",
      storageUrl: "https://9ddqvrucqgrr1dw7.public.blob.vercel-storage.com",
    },
  });

  const barberUser = await auth.api.signUpEmail({
    body: {
      name: "Lucas Alves",
      email: "lucasmatos47@gmail.com",
      image:
        "https://9ddqvrucqgrr1dw7.public.blob.vercel-storage.com/logo-quadrada.png",
      password: "Le362514.",
      role: "BARBER",
    },
  });

  const barber = await prisma.barber.create({
    data: {
      phone: "(61) 98338-2257",
      userId: barberUser.user.id,
    },
  });

  const createdServices = [] as {
    id: string;
    priceInCents: number;
  }[];

  for (const service of lucasServices) {
    const createdService = await prisma.barberService.create({
      data: {
        name: service.name,
        description: service.description,
        priceInCents: service.priceInCents,
        durationInMinutes: service.durationInMinutes,
        imageUrl: imagePaths.logoQuadrada,
        barber: {
          connect: {
            id: barber.id,
          },
        },
      },
    });

    createdServices.push({
      id: createdService.id,
      priceInCents: createdService.priceInCents,
    });
  }

  for (const workingDay of lucasWorkingDays) {
    await prisma.disponibility.create({
      data: {
        barberId: barber.id,
        dayOfWeek: workingDay.dayOfWeek,
        startTime: workingDay.startTime,
        endTime: workingDay.endTime,
      },
    });
  }

  return { barbershopId: barbershop.id, barberId: barber.id };
}

seedLucasBarbershop()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async error => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
