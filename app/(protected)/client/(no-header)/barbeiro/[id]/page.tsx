import { RiInstagramFill } from "@remixicon/react";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBarberById } from "@/features/barber/services/barbers.repository";
import { ServiceItem } from "@/features/service/components/service-item";
import { PhoneItem } from "@/shared/components/phone-item";
import { ProfilePhoto } from "@/shared/components/profile-photo";
import { AnimatedThemeToggler } from "@/shared/components/ui/animated-theme-toggler";
import { Button } from "@/shared/components/ui/button";
import {
  PageContainer,
  PageSection,
  PageSectionTitle,
} from "@/shared/components/ui/page";
import { Separator } from "@/shared/components/ui/separator";
import { imagePaths } from "@/shared/constants/images";
import { clientRoutes } from "@/shared/constants/routes";

const BarberPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const barber = await getBarberById(id);

  if (!barber) {
    return notFound();
  }

  return (
    <PageContainer>
      <div className="flex min-h-screen flex-col">
        <div className="relative h-70 w-full">
          <Image
            src={imagePaths.barberBanner}
            alt={"Banner da barbearia"}
            fill
            className="bg-black object-center"
            priority
          />

          <div className="absolute top-6 left-5">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full"
              asChild
            >
              <Link href={clientRoutes.dashboard}>
                <ChevronLeft className="size-5" />
              </Link>
            </Button>
          </div>

          <div className="absolute top-6 right-5">
            <AnimatedThemeToggler />
          </div>
        </div>

        <div className="relative -mt-6 flex flex-col gap-6 rounded-t-3xl bg-background">
          <PageSection>
            <div className="mb-1 flex items-center gap-4">
              <ProfilePhoto
                initial={barber.user?.name?.charAt(0).toUpperCase() ?? ""}
                imageUrl={barber.user?.image}
                size={12}
              />
              <div className="space-y-1">
                <h1 className="font-bold text-foreground text-xl">
                  {barber.user?.name}
                </h1>
                {barber.services.length > 0 ? (
                  <p className="text-muted-foreground text-sm">
                    {barber.services.length} serviços disponíveis
                  </p>
                ) : null}
              </div>
            </div>
          </PageSection>

          <Separator />

          <PageSection>
            <PageSectionTitle>Redes sociais</PageSectionTitle>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Button size="icon" variant="outline" asChild>
                <Link
                  href={`${barber.socialMedia[0]?.url ?? ""}`}
                  target="_blank"
                >
                  <RiInstagramFill className="size-4" />
                </Link>
              </Button>
            </div>
          </PageSection>

          <Separator />

          <PageSection>
            <PageSectionTitle>Serviços</PageSectionTitle>
            <div className="grid gap-4 md:grid-cols-2">
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

          <PageSection>
            <PageSectionTitle>Contato</PageSectionTitle>
            <div className="space-y-3">
              <PhoneItem phone={barber.phone || ""} />
            </div>
          </PageSection>
        </div>
      </div>
    </PageContainer>
  );
};

export default BarberPage;
