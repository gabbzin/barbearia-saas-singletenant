import type { BarberService } from "@prisma/client";
import { Clock } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface ServicesAndPricesProps {
  services: BarberService[];
}

export function ServicesAndPrices({ services }: ServicesAndPricesProps) {
  return (
    <section
      id="servicos"
      className="relative border-zinc-800 border-t bg-foreground py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-end justify-between gap-6 md:flex-row">
          <div className="max-w-xl">
            <h2 className="mb-3 font-bold text-amber-500 text-sm uppercase tracking-wide">
              Tabela de Preços
            </h2>
            <h3 className="font-bold text-3xl text-white md:text-4xl">
              Serviços de excelência,
              <br />
              preços transparentes.
            </h3>
          </div>
          <p className="text-sm text-zinc-400 md:text-right">
            Preços podem variar de acordo com a barbearia.
            <br />
            Consulte a disponibilidade no app.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(srv => {
            const popular =
              srv.name === "Corte de Cabelo" ||
              srv.name === "Barba" ||
              srv.name === "Corte + Barba";

            return (
              <div
                key={srv.id}
                className={`group relative flex h-full flex-col rounded-3xl border bg-zinc-950 p-6 transition-all duration-300 hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] ${popular ? "border-amber-500/30" : "border-zinc-800"}`}
              >
                {popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-3 py-1 font-bold text-xs text-zinc-950">
                    Mais Pedido
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="mb-2 font-bold text-white text-xl">
                    {srv.name}
                  </h4>
                  <div className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
                    <Clock size={16} />
                    <span>Duração: {srv.durationInMinutes}</span>
                  </div>
                </div>
                <div className="mt-auto">
                  <div className="mb-6 flex items-baseline gap-1">
                    <span className="text-sm text-zinc-400">R$</span>
                    <span className="font-black text-3xl text-white">
                      {(srv.priceInCents / 100).toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  <Button
                    className={`w-full rounded-xl py-3 font-bold transition-all${popular ? "bg-amber-500 text-zinc-950 hover:bg-amber-400" : "bg-zinc-800 text-white hover:bg-zinc-700"}`}
                  >
                    Agendar
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
