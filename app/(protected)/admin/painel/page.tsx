import { DollarSign, PlusCircle, Scissors, Users } from "lucide-react";
import Header from "@/shared/components/header";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

// Dados mockados para exibição
const stats = [
  {
    title: "Receita Total",
    value: "R$ 15.231,00",
    icon: DollarSign,
    description: "+20.1% em relação ao último mês",
  },
  {
    title: "Agendamentos",
    value: "+2350",
    icon: Scissors,
    description: "+180.1% em relação ao último mês",
  },
  {
    title: "Barbeiros Ativos",
    value: "12",
    icon: Users,
    description: "+2 novos barbeiros este mês",
  },
];

const barbers = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@barbearia.com",
    status: "Ativo",
  },
  {
    id: 2,
    name: "Maria Oliveira",
    email: "maria@barbearia.com",
    status: "Ativo",
  },
  {
    id: 3,
    name: "Carlos Pereira",
    email: "carlos@barbearia.com",
    status: "Férias",
  },
];

// Adicionar o status do barbeiro, pode ser uma opção futura para filtrar
// ou destacar barbeiros com status diferentes.

export default function AdminPainelPage() {
  return (
    <>
      <Header />

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
          <div className="flex items-center space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Barbeiro
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                  <DialogTitle>Adicionar Barbeiro</DialogTitle>
                  <DialogDescription>
                    Adicione um novo barbeiro à sua equipe. Preencha os dados
                    abaixo.
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
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, _index) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
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
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {barbers.map(barber => (
                    <TableRow key={barber.id}>
                      <TableCell className="font-medium">
                        {barber.name}
                      </TableCell>
                      <TableCell>{barber.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </PageSection>
      </PageContainer>
    </>
  );
}
