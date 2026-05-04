import { AlertCircle, PiggyBankIcon } from "lucide-react";
import { getBarberDefaultTimes } from "@/features/dashboard_barber/actions/getDefaultTimes";
import { getBarberDashboardInfos } from "@/features/dashboard_barber/actions/getInfos";
import { getTimeline } from "@/features/dashboard_barber/actions/getTimeline";
import { BarChartGraph } from "@/features/dashboard_barber/components/charts/barchart-comp";
import MainCardDashboard from "@/features/dashboard_barber/components/main-dashboard-card";
import { NewBookingManualDialog } from "@/features/dashboard_barber/components/new-booking-manual-dialog";
import { SpeedDial } from "@/features/dashboard_barber/components/SpeedDial";
import { TableBarberBreak } from "@/features/dashboard_barber/components/tables/table-barber-break";
import { ServiceList } from "@/features/dashboard_barber/components/tables/table-service";
import { TableSettings } from "@/features/dashboard_barber/components/tables/table-settings";
import { TimelineBarber } from "@/features/dashboard_barber/components/timeline-barber";
import { prisma } from "@/lib/prisma";
import { Alert, AlertTitle } from "@/shared/components/ui/alert";
import { PageSection, PageSectionTitle } from "@/shared/components/ui/page";
import { NextBookingsCard } from "@/features/dashboard_barber/components/next-bookings-card";
import { Badge } from "@/shared/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function BarberDashboardPage() {
  const [{ data: dash }, defaultTimes, { data: timelineData }] =
    await Promise.all([
      getBarberDashboardInfos(),
      getBarberDefaultTimes(),
      getTimeline(),
    ]);

  const barberId = dash?.barberId ? dash.barberId : null;

  const disponibility = await prisma.disponibility.findMany({
    where: {
      barberId: dash?.barberId,
    },
  });

  // Refatorar e rever o uso disso (aparenta ser inutil)
  const defaultTimesValues = defaultTimes.data?.defaultTimes ?? undefined;

  if (!barberId) {
    return;
  }

  return (
    <main className="flex flex-col gap-2">
      {!disponibility && (
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
        <div className="hidden gap-4 md:flex md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <h1 className="font-extrabold text-2xl tracking-tight md:text-3xl">
              Dashboard de <span className="text-primary">Gestão</span>
            </h1>
            <p className="font-medium text-muted-foreground text-sm italic">
              Aqui está o resumo estratégico do seu dia.
            </p>
          </div>
          <div className="hidden md:block">
            <NewBookingManualDialog barberId={barberId} />
          </div>
        </div>
      </PageSection>

      <PageSection>
        <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <MainCardDashboard
            Icon={PiggyBankIcon}
            title="Faturamento de hoje"
            value={dash?.todayData.billing.formatted}
            growthPercentage={
              dash?.comparisonsData.billingGrowthPercentage ?? 0
            }
          />
        </section>
      </PageSection>

      <PageSection>
        <PageSectionTitle className="flex items-center justify-between">
          Resumo do seu dia{" "}
          <Badge variant="success">
            {dash?.todayData.bookingsPerformed}/
            {dash?.bookingsData.totalScheduledToday} concluídos
          </Badge>{" "}
        </PageSectionTitle>
        <div className="w-full flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          <TimelineBarber
            timeline={timelineData?.finalArray ?? []}
            currentIndex={timelineData?.currentIndex}
          />
        </div>
      </PageSection>

      <PageSection>
        <div className="grid gap-4">
          <PageSectionTitle className="">
            Próximos agendamentos
          </PageSectionTitle>
          <NextBookingsCard bookings={dash?.bookingsData.next} />
        </div>
      </PageSection>

      <PageSection>
        <PageSectionTitle className="md:hidden">
          Faturamento Semanal
        </PageSectionTitle>
        <div>
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
      </PageSection>

      <PageSection>
        <PageSectionTitle>Serviços cadastrados</PageSectionTitle>
        <ServiceList barberId={barberId} />
      </PageSection>

      <PageSection>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:gap-6">
          <TableBarberBreak barberId={barberId} />
          <TableSettings barberId={barberId} />
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
