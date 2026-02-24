import {
  RiFacebookFill,
  RiInstagramFill,
  RiTwitterXFill,
} from "@remixicon/react";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ServiceItem } from "@/features/service/components/service-item";
import { prisma } from "@/lib/prisma";
import { PhoneItem } from "@/shared/components/phone-item";
import { ProfilePhoto } from "@/shared/components/profile-photo";
import { Button } from "@/shared/components/ui/button";
import { PageSection, PageSectionTitle } from "@/shared/components/ui/page";
import { Separator } from "@/shared/components/ui/separator";

const BarberPage = async (props: PageProps<"/client/barbeiro/[id]">) => {
  const { id } = await props.params;

  const barber = await prisma.barber.findUnique({
    where: {
      id,
    },
    include: {
      services: true,
      user: true,
    },
  });

  if (!barber) {
    return notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header com Banner */}
      <div className="relative h-70 w-full">
        <Image
          src={"/banner-barber.png"}
          alt={"Banner da barbearia"}
          fill
          className="object-center"
          priority
        />

        {/* Botão Voltar */}
        <div className="absolute top-6 left-5">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full"
            asChild
          >
            <Link href="/">
              <ChevronLeft className="size-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Container Principal */}
      <div className="relative -mt-6 flex flex-col gap-6 rounded-t-3xl bg-background">
        {/* Informações do barbeiro */}
        <PageSection>
          <div className="mb-1 flex items-center gap-4">
            <ProfilePhoto
              initial={barber.user?.name?.charAt(0).toUpperCase() ?? ""}
              imageUrl={barber.imageUrl}
              size={12}
            />
            <h1 className="font-bold text-foreground text-xl">
              {barber.user?.name}
            </h1>
          </div>
          {/* <p className="text-muted-foreground text-sm">{barber.address}</p> */}
        </PageSection>

        <Separator />

        {/* Redes Sociais */}
        {/* Componentizar depois */}
        <PageSection>
          <PageSectionTitle>Redes Sociais</PageSectionTitle>
          <div className="mt-2 flex flex-1 items-center justify-center gap-6">
            <RiFacebookFill />
            <RiInstagramFill />
            <RiTwitterXFill />
          </div>
        </PageSection>

        <Separator />

        {/* Serviços */}
        <PageSection>
          <PageSectionTitle>Serviços</PageSectionTitle>
          <div className="space-y-3">
            {barber.services.map(service => (
              <ServiceItem
                key={service.id}
                service={{
                  ...service,
                  // biome-ignore lint/style/noNonNullAssertion: <User tem que existir aqui>
                  barber: { ...barber, user: barber.user! },
                }}
              />
            ))}
          </div>
        </PageSection>

        <Separator />

        {/* Contato */}
        <div className="space-y-3 px-5">
          <h2 className="font-bold text-foreground text-xs uppercase">
            Contato
          </h2>
          <div className="space-y-3">
            {barber.phone.length > 0 ? (
              barber.phone.map(phone => (
                <div
                  key={phone}
                  className="flex w-full flex-col items-center justify-between"
                >
                  <PhoneItem phone={phone} />
                </div>
              ))
            ) : (
              <p>Telefone não disponível</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarberPage;
