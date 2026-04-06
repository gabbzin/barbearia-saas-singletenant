import { format } from "date-fns";
import {
  AlertCircle,
  AlertCircleIcon,
  Banknote,
  Clock7Icon,
  PiggyBankIcon,
  Scissors,
  UserIcon,
} from "lucide-react";
import CardInfo from "@/features/barber/components/card-info";
import { getBarberDefaultTimes } from "@/features/dashboard_barber/actions/getDefaultTimes";
import { getBarberDashboardInfos } from "@/features/dashboard_barber/actions/getInfos";
import MainCardDashboard from "@/features/dashboard_barber/components/main-dashboard-card";
import { NewBookingManualDialog } from "@/features/dashboard_barber/components/new-booking-manual-dialog";
import { NextBookingsSection } from "@/features/dashboard_barber/components/next-bookings-section";
import { SpeedDial } from "@/features/dashboard_barber/components/SpeedDial";
import { TableBarberBreak } from "@/features/dashboard_barber/components/table-barber-break";
import { TableService } from "@/features/dashboard_barber/components/table-service";
import { TableSettings } from "@/features/dashboard_barber/components/table-settings";
import { prisma } from "@/lib/prisma";
import { Alert, AlertTitle } from "@/shared/components/ui/alert";
import { PageSection, PageSectionTitle } from "@/shared/components/ui/page";
import { Progress } from "@/shared/components/ui/progress";
import { BarChartGraph } from "@/features/dashboard_barber/components/charts/barchart-comp";

export default async function BarberDashboardPage() {
  const [{ data: dash }, defaultTimes] = await Promise.all([
    getBarberDashboardInfos(),
    getBarberDefaultTimes(),
  ]);

  const barberId = dash?.barberId ? dash.barberId : null;

  const disponibility = await prisma.disponibility.findMany({
    where: {
      barberId: dash?.barberId,
    },
  });

  const horariosData = defaultTimes.data?.horariosData ?? null;
  const defaultTimesValues = defaultTimes.data?.defaultTimes ?? undefined;

  if (!barberId) {
    return;
  }

  return (
    <main className="flex flex-col gap-2">
      {!horariosData && (
        <PageSection>
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
        </PageSection>
      )}

      <PageSection>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-extrabold text-2xl tracking-tight md:text-3xl">
              Dashboard de <span className="text-primary">Gestão</span>
            </h1>
            <p className="mt-1 font-medium text-muted-foreground text-sm italic">
              Aqui está o resumo estratégico do seu dia.
            </p>
          </div>
          <div className="hidden md:block">
            <NewBookingManualDialog barberId={barberId} />
          </div>
        </div>

        <MainCardDashboard
          Icon={PiggyBankIcon}
          title="Faturamento de hoje"
          value={dash?.todayData.billing.formatted}
          growthPercentage={dash?.comparisonsData.billingGrowthPercentage ?? 0}
        />
      </PageSection>

      <PageSection>
        <section className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          <CardInfo
            Icon={Scissors}
            title="Realizados"
            value={dash?.todayData.servicesPerformed}
            variant="basic"
            details={
              <Progress
                value={dash?.bookingsData.progressToday}
                className="w-[60%] text-black"
              />
            }
          />
          <CardInfo
            Icon={UserIcon}
            title="Marcados Total"
            value={dash?.bookingsData.totalScheduledToday}
            variant="basic"
          />
          <CardInfo
            Icon={Banknote}
            title="Faturamento"
            value={dash?.todayData.billing.formatted}
            variant="basic"
            classNameCard="hidden md:block"
          />
          <CardInfo
            Icon={AlertCircleIcon}
            title="Pendentes"
            value={dash?.bookingsData.pendingConfirmationToday}
            variant="basic"
          />
          <CardInfo
            Icon={Clock7Icon}
            title={horariosData?.endTime ? "Trabalho até:" : "Dia de hoje"}
            value={
              horariosData?.endTime
                ? horariosData.endTime
                : format(new Date(), "dd 'de' MMM")
            }
            variant="basic"
          />
        </section>
      </PageSection>

      <PageSection>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <div className="grid gap-2">
              <PageSectionTitle>Próximos agendamentos</PageSectionTitle>
              <NextBookingsSection bookings={dash?.bookingsData.next} />
            </div>

            <div className="grid gap-2">
              <PageSectionTitle>Faturamento Semanal</PageSectionTitle>
              <BarChartGraph
                chartConfig={{
                  saldoEmReais: {
                    label: "Saldo",
                    color: "#6366F1",
                  },
                }}
                data={dash?.analyticsData.weeklyBillingData ?? []}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-1 xl:gap-6">
            <TableService barberId={barberId} />
            <TableSettings barberId={barberId} />
            <TableBarberBreak barberId={barberId} />
          </div>
        </div>
      </PageSection>

      <SpeedDial
        barberId={barberId}
        defaultTimes={defaultTimesValues}
        disponibility={disponibility}
      />
    </main>
  );
}
