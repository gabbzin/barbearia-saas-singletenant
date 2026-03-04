"use client";

import { History, Plus, User } from "lucide-react";
import { toast } from "sonner";
import { DatePicker } from "../components/date-picker";
import { SelectForm } from "../components/form/select-form";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export function ClientNavs() {
  const actions = [
    {
      icon: User,
      label: "Barbeiros",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      dev: true,
    },
    {
      icon: History,
      label: "Histórico",
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      dev: true,
    },
  ];

  return (
    <div className="mb-10 grid grid-cols-4 gap-3">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            size="card"
            className="group flex flex-col items-center justify-center gap-3 rounded-2xl p-4 backdrop-blur-2xl transition-all duration-300 hover:bg-primary/10"
          >
            <div className="rounded-xl bg-amber-500/10 p-3 text-amber-500 transition-transform group-hover:scale-110">
              <Plus size={22} />
            </div>
            <span className="font-semibold text-xs sm:text-sm">Agendar</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="space-y-4">
          <DialogHeader>
            <DialogTitle>Novo agendamento</DialogTitle>
            <DialogDescription>
              Use este formulário rápido para registrar um atendimento
              presencial.
            </DialogDescription>
          </DialogHeader>

          <form
            className="space-y-3 text-sm"
            onSubmit={event => {
              event.preventDefault();
              toast.info("Conecte este formulário ao RHF e à action.");
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="manual-booking-name">Nome do cliente</Label>
              <Input
                id="manual-booking-name"
                name="name"
                placeholder="Nome do cliente"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="manual-booking-phone">Telefone / WhatsApp</Label>
              <Input
                id="manual-booking-phone"
                name="phone"
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="manual-booking-service">Serviço</Label>
              <Input
                id="manual-booking-service"
                name="service"
                placeholder="Selecione o serviço"
              />
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="manual-booking-date">Data</Label>
                <DatePicker
                  date={new Date()}
                  setDate={() => {
                    return;
                  }}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="manual-booking-payment">
                  Forma de pagamento
                </Label>
                <SelectForm
                  name="paymentMethod"
                  placeholder="Ex: Dinheiro, Pix, Cartão"
                  items={[
                    { value: "dinheiro", label: "Dinheiro" },
                    { value: "pix", label: "Pix" },
                    { value: "cartao", label: "Cartão" },
                  ]}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="sm">
              Salvar agendamento
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {actions.map((action, idx) => (
        <Button
          // biome-ignore lint/suspicious/noArrayIndexKey: <Relaxe>
          key={idx}
          variant={"secondary"}
          size="card"
          className="group flex flex-col items-center justify-center gap-3 rounded-2xl p-4 backdrop-blur-2xl transition-all duration-300 hover:bg-primary/10"
          onClick={
            action.dev
              ? () => {
                  toast.info("Em desenvolvimento");
                }
              : undefined
          }
        >
          <div
            className={`${action.bg} ${action.color} rounded-xl p-3 transition-transform group-hover:scale-110`}
          >
            <action.icon size={22} />
          </div>
          <span className="font-semibold text-xs sm:text-sm">
            {action.label}
          </span>
        </Button>
      ))}
    </div>
  );
}
