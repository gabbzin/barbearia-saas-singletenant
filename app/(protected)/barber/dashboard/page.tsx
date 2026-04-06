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
import { GraphCard } from "@/features/dashboard_barber/components/graph-card";
import MainCardDashboard from "@/features/dashboard_barber/components/main-dashboard-card";
import { NewBookingManualDialog } from "@/features/dashboard_barber/components/new-booking-manual-dialog";
import { NextBookingsSection } from "@/features/dashboard_barber/components/next-bookings-section";
import { SpeedDial } from "@/features/dashboard_barber/components/SpeedDial";
import { TableBarberBreak } from "@/features/dashboard_barber/components/table-barber-break";
import { TableService } from "@/features/dashboard_barber/components/table-service";
import { TableSettings } from "@/features/dashboard_barber/components/table-settings";
import { prisma } from "@/lib/prisma";
import { Alert, AlertTitle } from "@/shared/components/ui/alert";
import { PageSection } from "@/shared/components/ui/page";
import { Progress } from "@/shared/components/ui/progress";

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
    <main>
      <PageSection>
        {!horariosData && (
          <div className="mb-4">
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
          </div>
        )}
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-2 py-4 lg:px-0 lg:py-6">
          <div className="hidden flex-col justify-between gap-4 md:flex md:flex-row md:items-center">
            <div>
              <h1 className="font-extrabold text-3xl tracking-tight">
                Dashboard de <span className="text-primary">Gestão</span>
              </h1>
              <p className="mt-1 font-medium text-muted-foreground text-sm italic">
                Aqui está o resumo estratégico do seu dia.
              </p>
            </div>
            <NewBookingManualDialog barberId={barberId} />
          </div>

          <MainCardDashboard
            Icon={PiggyBankIcon}
            title="Faturamento de hoje"
            value={dash?.todayData.billing.formatted}
            growthPercentage={
              dash?.comparisonsData.billingGrowthPercentage ?? 0
            }
          />

          <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            <CardInfo
              Icon={Scissors}
              title="Realizados"
              value={dash?.todayData.servicesPerformed}
              variant="basic"
              details={
                <Progress
                  value={dash?.todayData.servicesPerformed}
                  className="w-[60%] text-black"
                />
              }
            />
            <CardInfo
              Icon={UserIcon}
              title="Agendados"
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

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <NextBookingsSection bookings={dash?.bookingsData.next} />

              <GraphCard
                title="Faturamento Semanal"
                description="Desempenho financeiro da semana"
                todayBilling={dash?.todayData.billing.formatted ?? "R$ 0,00"}
                growthPercentage={
                  dash?.comparisonsData.billingGrowthPercentage ?? 0
                }
                weeklyBillingData={dash?.analyticsData.weeklyBillingData ?? []}
              />
            </div>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-1 lg:space-y-8">
              <TableService barberId={barberId} />
              <TableSettings barberId={barberId} />
              <TableBarberBreak barberId={barberId} />
            </div>
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
