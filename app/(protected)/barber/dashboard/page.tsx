import { format } from "date-fns";
import {
  AlertCircle,
  AlertCircleIcon,
  Banknote,
  Calendar,
  Scissors,
  TrendingDown,
  TrendingUp,
  UserIcon,
} from "lucide-react";
import CardInfo from "@/features/barber/components/card-info";
import { getBarberDefaultTimes } from "@/features/dashboard_barber/actions/getDefaultTimes";
import { getBarberDashboardInfos } from "@/features/dashboard_barber/actions/getInfos";
import { CardTable } from "@/features/dashboard_barber/components/card-table";
import { BarChartGraph } from "@/features/dashboard_barber/components/charts/barchart-comp";
import { SpeedDial } from "@/features/dashboard_barber/components/SpeedDial";
import { TableService } from "@/features/dashboard_barber/components/table-service";
import { TableSettings } from "@/features/dashboard_barber/components/table-settings";
import { Alert, AlertTitle } from "@/shared/components/ui/alert";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { PageSection } from "@/shared/components/ui/page";
import { TableCell, TableRow } from "@/shared/components/ui/table";

export default async function BarberDashboardPage() {
  const [info, defaultTimes] = await Promise.all([
    getBarberDashboardInfos(),
    getBarberDefaultTimes(),
  ]);

  const barberId = info.data?.barberId ? info.data.barberId : null;

  const horariosData = defaultTimes.data?.horariosData ?? null;
  const defaultTimesValues = defaultTimes.data?.defaultTimes ?? undefined;

  if (!barberId) {
    return;
  }

  return (
    <main className="pb-20">
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
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="font-extrabold text-3xl tracking-tight">
                Dashboard de <span className="text-primary">Gestão</span>
              </h1>
              <p className="mt-1 font-medium text-muted-foreground text-sm italic">
                Aqui está o resumo estratégico do seu dia.
              </p>
            </div>
          </div>

          <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
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
              Icon={AlertCircleIcon}
              title="Não confirmados"
              value={info.data?.bookingsNotConfirmedToday}
              variant="red"
            />
            <CardInfo
              Icon={Calendar}
              title={horariosData?.endTime ? "Trabalho até:" : "Dia de hoje"}
              value={
                horariosData?.endTime
                  ? horariosData.endTime
                  : format(new Date(), "dd 'de' MMM")
              }
              variant="yellow"
            />
          </section>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <CardTable
                titleCard="Próximos agendamentos (máx. 5)"
                linkText="Ver agenda completa"
                url="/barber/schedule"
                tableTitles={["Cliente", "Serviço", "Data/Hora", "Status"]}
              >
                {info.data?.nextBooking ? (
                  info.data.nextBooking.map(booking => (
                    <TableRow className="border-t" key={booking.id}>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm">
                              {booking.user.name}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 font-semibold text-muted-foreground text-sm">
                        {booking.service.name}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm">
                        <p className="font-semibold">
                          {format(booking.date, "HH:mm")}
                        </p>
                        <p className="font-semibold text-[10px] text-muted-foreground uppercase">
                          Hoje
                        </p>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm">
                        <Badge
                          variant={
                            booking.status === "CANCELLED"
                              ? "destructive"
                              : "success"
                          }
                        >
                          {booking.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="px-6 py-6 text-center text-muted-foreground text-sm"
                    >
                      Nenhum agendamento encontrado
                    </TableCell>
                  </TableRow>
                )}
              </CardTable>

              <Card className="overflow-hidden rounded-3xl border bg-card shadow-sm">
                <CardHeader className="border-b px-6 py-4">
                  <CardTitle className="font-bold text-lg">
                    Evolução de faturamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-black text-3xl italic">
                        {info.data?.todayBilling ?? "R$ 0,00"}
                      </p>
                      <p className="font-medium text-muted-foreground text-sm">
                        Faturamento de hoje
                      </p>
                    </div>
                    <div className="font-semibold text-sm">
                      {info.data?.growthPercentage &&
                      info.data.growthPercentage >= 0 ? (
                        <div className="flex items-center gap-2 text-green-500">
                          <TrendingUp className="h-5 w-5" />
                          <span>{info.data?.growthPercentage}%</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-500">
                          <TrendingDown className="h-5 w-5" />
                          <span>{info.data?.growthPercentage ?? 0}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <BarChartGraph
                    chartConfig={{
                      saldo: {
                        label: "Saldo",
                        color: "#60a5fa",
                      },
                    }}
                    data={info.data?.weeklyBillingData ?? []}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <TableService barberId={barberId} />
              <TableSettings barberId={barberId} />
            </div>
          </div>
        </div>
      </PageSection>

      <SpeedDial barberId={barberId} defaultTimes={defaultTimesValues} />
    </main>
  );
}
