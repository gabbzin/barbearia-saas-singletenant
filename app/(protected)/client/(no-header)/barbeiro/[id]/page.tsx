import { CheckCircle2Icon, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBarberById } from "@/features/barber/services/barbers.repository";
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
import { Badge } from "@/shared/components/ui/badge";
import { SocialIconComponent } from "@/shared/components/socials/social-icon";
import { ServiceCard } from "@/features/service/components/service-card";

const BarberPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const barber = await getBarberById(id);

  if (!barber) {
    return notFound();
  }

  return (
    <PageContainer>
      <div className="flex min-h-screen flex-col">
        {/* Banner */}
        <div className="relative h-70 w-full">
          <Image
            src={imagePaths.barberBanner}
            alt={"Banner da barbearia"}
            fill
            className="bg-black object-cover object-center brightness-50"
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

        <div className="relative -mt-6 flex flex-col gap-2 rounded-t-3xl bg-background">
          <PageSection>
            <div className="-mt-12 mb-1 flex flex-col items-center justify-center gap-2">
              <div className="relative rounded-full border-2 border-gold">
                <ProfilePhoto
                  initial={barber.user?.name?.charAt(0).toUpperCase() ?? ""}
                  imageUrl={barber.user?.image}
                  size={20}
                  enabledGoldEffect={true}
                />
                <div className="absolute right-0 bottom-0 rounded-full bg-gold text-primary">
                  <CheckCircle2Icon />
                </div>
              </div>
              <div className="space-y-1">
                <h1 className="text-center font-bold text-foreground text-xl">
                  {barber.user?.name}
                </h1>
                {barber.services.length > 0 ? (
                  <Badge variant={"default_highlight"}>
                    {barber.services.length} serviços disponíveis
                  </Badge>
                ) : null}
              </div>
              <div className="mt-1">
                <div className="flex flex-wrap items-center gap-3">
                  {barber.socialMedia.map(rs => {
                    const [width, height] = [32, 32];

                    return (
                      <Button key={rs.id} size="icon" variant="outline" asChild>
                        <SocialIconComponent
                          url={rs.url}
                          width={width}
                          height={height}
                        />
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </PageSection>

          <Separator />

          <PageSection>
            <PageSectionTitle>Serviços Disponíveis</PageSectionTitle>
            <div className="grid gap-4 md:grid-cols-2">
              {barber.services.map(service => (
                <ServiceCard key={service.id} service={service} />
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
