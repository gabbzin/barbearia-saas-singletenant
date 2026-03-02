import { format } from "date-fns";
import {
  AlertCircle,
  Banknote,
  Calendar,
  Scissors,
  TrendingDown,
  TrendingUp,
  UserIcon,
} from "lucide-react";
import { notFound } from "next/navigation";
import CardInfo from "@/features/barber/components/card-info";
import { verifySession } from "@/features/user/repository/user.repository";
import { prisma } from "@/lib/prisma";
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
import { getBarberDashboardInfos } from "./actions/getInfos";
import { CardTable } from "./components/card-table";
import { SpeedDial } from "./components/SpeedDial";
import { TableService } from "./components/table-service";
import { TableSettings } from "./components/table-settings";

type RevenuePoint = {
  label: string;
  value: number;
};

const REVENUE_CHART_DATA: RevenuePoint[] = [
  { label: "Set", value: 3100 },
  { label: "Out", value: 4200 },
  { label: "Nov", value: 3800 },
  { label: "Dez", value: 5100 },
  { label: "Jan", value: 4500 },
  { label: "Fev", value: 4250 },
];

const SimpleBarChart = ({ data }: { data: RevenuePoint[] }) => {
  const max = Math.max(...data.map(item => item.value));

  if (!max) {
    return null;
  }

  return (
    <div className="flex h-32 items-end gap-2 px-2">
      {data.map(item => (
        <div
          key={item.label}
          className="group flex flex-1 flex-col items-center gap-2"
        >
          <div
            className="relative w-full rounded-t-lg bg-primary/10 transition-colors group-hover:bg-primary"
            style={{ height: `${(item.value / max) * 100}%` }}
          >
            <div className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-popover px-2 py-1 text-[10px] text-popover-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
              R$ {item.value}
            </div>
          </div>
          <span className="font-semibold text-[10px] text-muted-foreground uppercase">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default async function BarberDashboardPage() {
  const session = await verifySession();

  if (!session || session?.role === "USER") {
    notFound();
  }

  const barber = await prisma.barber.findUnique({
    where: { userId: session.id },
    select: { id: true },
  });

  if (!barber) {
    notFound();
  }

  const barberId = barber.id;

  const info = await getBarberDashboardInfos({ barberId });

  const horariosData = await prisma.disponibility.findUnique({
    where: {
      barberId_dayOfWeek: {
        barberId: barberId,
        dayOfWeek: new Date().getDay(),
      },
    },
  });

  console.log(
    horariosData?.startTime,
    horariosData?.endTime,
    typeof horariosData?.startTime,
  );
  const defaultTimesValues = horariosData
    ? {
        horario_abertura: horariosData.startTime,
        horario_fechamento: horariosData.endTime,
        "0": horariosData.dayOfWeek === 0,
        "1": horariosData.dayOfWeek === 1,
        "2": horariosData.dayOfWeek === 2,
        "3": horariosData.dayOfWeek === 3,
        "4": horariosData.dayOfWeek === 4,
        "5": horariosData.dayOfWeek === 5,
        "6": horariosData.dayOfWeek === 6,
      }
    : undefined;

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
                Olá, {session.name ?? "Usuário"}. Aqui está o resumo estratégico
                do seu dia.
              </p>
            </div>
          </div>

          <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
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
                  <TableRow className="border-t">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm">
                            {info.data.nextBooking.user.name}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 font-semibold text-muted-foreground text-sm">
                      {info.data.nextBooking.service.name}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm">
                      <p className="font-semibold">
                        {format(info.data.nextBooking.date, "HH:mm")}
                      </p>
                      <p className="font-semibold text-[10px] text-muted-foreground uppercase">
                        Hoje
                      </p>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm">
                      <Badge
                        variant={
                          info.data.nextBooking.status === "CANCELLED"
                            ? "destructive"
                            : "success"
                        }
                      >
                        {info.data.nextBooking.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                  </TableRow>
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
                  <SimpleBarChart data={REVENUE_CHART_DATA} />
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
