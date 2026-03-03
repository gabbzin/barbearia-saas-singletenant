import { format } from "date-fns";
import {
  AlertCircle,
  Banknote,
  Calendar,
  Scissors,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { verifySession } from "@/features/user/repository/user.repository";
import CardInfo from "@/features/barber/components/card-info";
import { Alert, AlertTitle } from "@/shared/components/ui/alert";
import { Avatar, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { PageSection, PageSectionTitle } from "@/shared/components/ui/page";
import { Separator } from "@/shared/components/ui/separator";
import { getBarberDashboardInfos, getBarberDefaultTimes } from "./actions/getInfos";
import { SpeedDial } from "./components/SpeedDial";
import { TableService } from "./components/table-service";
import { TableSettings } from "./components/table-times-services";

const BarberDashboardPage = async () => {
  const session = await verifySession();

  if (!session || session.role !== "BARBER" || !session.barberId) {
    notFound();
  }

  const barberId = session.barberId;

  const [info, defaultTimesResult] = await Promise.all([
    getBarberDashboardInfos(),
    getBarberDefaultTimes(),
  ]);

  const defaultTimesValues = defaultTimesResult?.data?.defaultTimes ?? undefined;

  return (
    <main>
      {!defaultTimesValues && (
        <Alert>
          <AlertTitle className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-10 w-10" />
              <span>
                Você ainda não configurou seus horários padrão. Por favor,
                configure-os nas configurações abaixo.
              </span>
            </div>
          </AlertTitle>
        </Alert>
      )}

      <PageSection>
        <h2 className="font-bold text-2xl lg:text-3xl">
          Olá {session.name ?? "Usuario"}
        </h2>

        <PageSectionTitle>Resumo de hoje</PageSectionTitle>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          <CardInfo
            Icon={Scissors}
            title="Realizados"
            value={info.data?.servicesPerformed}
            variant="blue"
          />
          <CardInfo
            Icon={UserIcon}
            title="Agendados"
            value={info.data?.totalSchedules}
            variant="red"
          />
          <CardInfo
            Icon={Banknote}
            title="Faturamento"
            value={info.data?.todayBilling}
            variant="green"
          />
          <CardInfo
            Icon={Calendar}
            title="Dia de hoje"
            value={format(new Date(), "dd/MM")}
            variant="yellow"
          />
        </div>
      </PageSection>

      <Separator />

      <PageSection>
        <PageSectionTitle>Próximo atendimento</PageSectionTitle>
        <Card className="border border-primary">
          <CardContent className="flex flex-col gap-3">
            {info.data?.nextBooking ? (
              <>
                <div className="flex items-center gap-4 font-semibold">
                  <Avatar>
                    <AvatarImage
                      src={info.data?.nextBooking.user.image ?? undefined}
                      alt={info.data?.nextBooking.user.name ?? "User Avatar"}
                      className="object-cover"
                    />
                  </Avatar>
                  <p>{info.data?.nextBooking.user.name}</p>
                </div>
                <div className="space-y-1">
                  <p>
                    <span className="font-bold">Serviço: </span>
                    {info.data?.nextBooking.service.name}
                  </p>
                  <p>
                    <span className="font-bold">Horário: </span>
                    {info.data?.nextBooking.date.toTimeString().substring(0, 5)}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-center">Nenhum agendamento encontrado</p>
            )}

            <Button variant={"outline"} asChild>
              <Link href="/barber/schedule">Ver agenda completa</Link>
            </Button>
          </CardContent>
        </Card>
      </PageSection>

      <Separator />

      <PageSection>
        <PageSectionTitle>Seus serviços cadastrados</PageSectionTitle>
        <TableService barberId={barberId} />
      </PageSection>

      <PageSection>
        <PageSectionTitle>Seus horários padrão</PageSectionTitle>
        <TableSettings barberId={barberId} />
      </PageSection>

      <div className="h-20" />

      <SpeedDial barberId={barberId} defaultTimes={defaultTimesValues} />
    </main>
  );
};

export default BarberDashboardPage;
