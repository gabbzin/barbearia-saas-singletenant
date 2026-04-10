import type { BarberService } from "@prisma/client";
import { ArrowRight } from "lucide-react";

interface ServicesAndPricesProps {
  services: BarberService[];
}

export function ServicesAndPrices({ services }: ServicesAndPricesProps) {
  return (
    <section id="services" className="bg-zinc-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 flex flex-wrap items-end gap-6">
          <div className="max-w-3xl">
            <span className="mb-4 block font-manrope font-semibold text-amber-300 text-xs uppercase tracking-[0.22em] sm:text-sm">
              Nossos serviços
            </span>
            <h2 className="font-poppins font-semibold text-4xl text-zinc-100 sm:text-5xl lg:text-6xl">
              Uma suite de precisão
            </h2>
          </div>
          <div className="hidden h-px flex-1 bg-zinc-700/70 lg:block lg:-translate-y-6" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map(service => (
            <article
              key={service.id}
              className="group relative overflow-hidden rounded-2xl border border-zinc-700/70 bg-zinc-950 p-8 transition-colors duration-500 hover:border-amber-300/70 hover:bg-zinc-900"
            >
              <div className="absolute top-0 left-0 h-0.5 w-0 bg-amber-300 transition-all duration-500 group-hover:w-full" />

              <h3 className="font-poppins font-semibold text-3xl text-zinc-100">
                {service.name}
              </h3>

              <p className="mt-4 max-w-sm font-manrope text-sm text-zinc-400 leading-relaxed">
                Atendimento de alta precisão, focado no seu visagismo e rotina.
              </p>

              <div className="mt-8 flex items-center justify-between">
                <span className="font-bold font-manrope text-2xl text-amber-300">
                  R$ {(service.priceInCents / 100).toFixed(2).replace(".", ",")}
                </span>
                <span className="font-manrope text-sm text-zinc-500">
                  {service.durationInMinutes} min
                </span>
              </div>

              <div className="mt-6 flex items-center justify-end text-zinc-400 transition-colors group-hover:text-amber-300">
                <ArrowRight size={18} />
              </div>
            </article>
          ))}
        </div>

        {services.length === 0 && (
          <div className="rounded-2xl border border-zinc-700/70 bg-zinc-950 p-8 text-center">
            <p className="font-manrope text-zinc-300">
              Nenhum serviço disponível no momento.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
