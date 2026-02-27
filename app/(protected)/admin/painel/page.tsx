import { DollarSign, PlusIcon, Scissors, Users } from "lucide-react";
import { getBarbers } from "@/features/barber/services/barbers.repository";
import Header from "@/shared/components/header";
import { Avatar, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  PageContainer,
  PageSection,
  PageSectionTitle,
} from "@/shared/components/ui/page";
import { convertBRL } from "@/utils/convertBRL";
import { getAdminDashboardInfos } from "./actions/getInfos";

// Adicionar o status do barbeiro, pode ser uma opção futura para filtrar
// ou destacar barbeiros com status diferentes.

export default async function AdminPainelPage() {
  const { data: infos } = await getAdminDashboardInfos();
  const barbers = await getBarbers();

  const stats = [
    {
      title: "Receita Total",
      value: convertBRL(infos?.monthlyEarnings._sum.priceInCents ?? 0),
      icon: DollarSign,
      description: `${infos?.monthlyEarningsPercentageChange.toFixed(2)}% em relação ao último mês`,
    },
    {
      title: "Agendamentos do mês",
      value: infos?.monthlyEarnings._count.id,
      icon: Scissors,
      description: `${infos?.monthlyEarningsDifferenceCount} em relação ao último mês`,
    },
    {
      title: "Barbeiros Ativos",
      value: infos?.barbersCount,
      icon: Users,
      description: "",
    },
  ];

  return (
    <>
      <Header />

      <Dialog>
        <DialogTrigger asChild className="fixed right-4 bottom-4">
          <Button className="size-12 rounded-full shadow-lg">
            <PlusIcon className="size-4 lg:size-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Adicionar Barbeiro</DialogTitle>
            <DialogDescription>
              Adicione um novo barbeiro à sua equipe. Preencha os dados abaixo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                placeholder="Pedro Santos"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="pedro@exemplo.com"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Salvar Barbeiro</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PageContainer>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-bold text-2xl tracking-tight">
              Dashboard Administrativo
            </h1>
            <p className="text-muted-foreground">
              Visão geral da sua barbearia e gerenciamento de equipe.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, _index) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">
                  {stat.title}
                </CardTitle>
                <stat.icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{stat.value}</div>
                <p className="text-muted-foreground text-xs">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <PageSection>
          <PageSectionTitle>Equipe de Barbeiros</PageSectionTitle>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {barbers.map(barber => (
              <Card key={barber.id} className="p-2">
                <CardContent className="flex items-center justify-start">
                  <Avatar className="my-2 mr-4 size-12">
                    <AvatarImage src={barber.user?.image ?? undefined} />
                  </Avatar>
                  <p className="font-bold text-lg">{barber.user?.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </PageSection>
      </PageContainer>
    </>
  );
}
