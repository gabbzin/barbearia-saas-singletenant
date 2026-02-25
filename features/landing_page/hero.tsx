import type { BarberService } from "@prisma/client";
import {
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clock,
  Scissors,
  Star,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
import { IconBadge } from "@/shared/components/icon-badge";
import { Button } from "@/shared/components/ui/button";

interface HeroProps {
  services: BarberService[];
}

export async function Hero({ services }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
      {/* Background Glows */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-100 w-200 -translate-x-1/2 rounded-full bg-amber-500/20 blur-[120px]"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-700/50 bg-zinc-800/50 px-4 py-2 font-medium text-amber-500 text-sm">
              <Star size={16} fill="currentColor" />
              <span>A revolução do agendamento chegou</span>
            </div>
            <h1 className="mb-6 font-bold text-5xl text-white leading-[1.1] tracking-tight lg:text-7xl">
              Agende seu corte em{" "}
              <span className="bg-linear-to-r from-amber-400 to-yellow-600 bg-clip-text text-transparent">
                segundos.
              </span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-zinc-400 leading-relaxed lg:mx-0 lg:text-xl">
              Esqueça as ligações e filas de espera. Escolha seu barbeiro
              favorito, o melhor horário e garanta seu estilo com praticidade e
              rapidez direto do seu celular.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <Button
                variant="gold"
                size="xl"
                className="w-full gap-2 font-bold text-lg shadow-lg transition-transform hover:scale-105 active:scale-95 sm:w-auto"
              >
                Agendar Meu Horário
                <ChevronRight size={20} />
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="w-full gap-2 font-bold text-lg sm:w-auto"
              >
                Ver Profissionais
              </Button>
            </div>

            <div className="mt-10 flex items-center justify-center gap-4 font-medium text-sm text-zinc-500 lg:justify-start">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className="h-10 w-10 overflow-hidden rounded-full border-2 border-zinc-950 bg-zinc-800"
                  >
                    <Image
                      width={50}
                      height={50}
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt="User"
                      className="h-full w-full object-cover opacity-80"
                    />
                  </div>
                ))}
              </div>
              <p>
                Mais de{" "}
                <strong className="text-zinc-300">10.000 clientes</strong>
                <br />
                agendando todos os meses.
              </p>
            </div>
          </div>

          {/* App Mockup UI (CSS Based) */}
          <div className="perspective-1000 relative mx-auto w-full max-w-md flex-1">
            {/* Decorative elements around phone */}
            <div
              className="absolute top-10 -right-8 animate-bounce rounded-2xl border border-zinc-700 bg-zinc-800 p-4 shadow-2xl"
              style={{ animationDuration: "3s" }}
            >
              <div className="flex items-center gap-3">
                <IconBadge icon={<CheckCircle2 size={20} />} variant="gold" />
                <div>
                  <p className="font-bold text-sm text-white">
                    Corte Confirmado
                  </p>
                  <p className="text-xs text-zinc-400">Hoje às 15:30</p>
                </div>
              </div>
            </div>

            {/* Phone Frame */}
            <div className="relative mx-auto h-162.5 w-full max-w-[320px] rotate-x-[5deg] rotate-y-[-5deg] transform overflow-hidden rounded-[2.5rem] border-[6px] border-zinc-800 bg-zinc-950 shadow-2xl shadow-amber-500/10">
              {/* Dynamic Island / Notch */}
              <div className="absolute inset-x-0 top-0 flex h-6 justify-center">
                <div className="h-6 w-32 rounded-b-3xl bg-zinc-950"></div>
              </div>

              {/* App Content */}
              <div className="flex h-full flex-col bg-zinc-900/50 p-6 pt-12">
                <header className="mb-8 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-400">Bem-vindo de volta,</p>
                    <p className="font-bold text-white text-xl">Thiago 👋</p>
                  </div>
                  <div className="h-12 w-12 overflow-hidden rounded-full border border-zinc-700 bg-zinc-800">
                    <Image
                      width={48}
                      height={48}
                      src="https://i.pravatar.cc/150?img=11"
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </header>

                <div className="relative mb-6 overflow-hidden rounded-3xl border border-zinc-700 bg-linear-to-br from-zinc-800 to-zinc-900 p-5">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Scissors size={64} />
                  </div>
                  <div className="mb-3 inline-block rounded-full bg-amber-500 px-3 py-1 font-bold text-xs text-zinc-950">
                    Próximo Agendamento
                  </div>
                  <h3 className="mb-1 font-bold text-lg text-white">
                    Corte + Barba
                  </h3>
                  <p className="mb-4 flex items-center gap-1 text-sm text-zinc-400">
                    <Clock size={14} /> Hoje, 15:30
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-zinc-700">
                      <Image
                        width={32}
                        height={32}
                        src="https://i.pravatar.cc/150?img=33"
                        alt="Barber"
                        className="h-full w-full rounded-full object-cover"
                      />
                    </div>
                    <span className="font-medium text-sm text-zinc-300">
                      com Diego Barber
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  <h4 className="mb-4 font-bold text-white">
                    Escolha um serviço
                  </h4>
                  <div className="space-y-3">
                    {services.slice(0, 3).map(srv => (
                      <div
                        key={srv.id}
                        className="flex items-center justify-between rounded-2xl border border-zinc-700/50 bg-zinc-800/50 p-4"
                      >
                        <div>
                          <p className="font-bold text-sm text-white">
                            {srv.name}
                          </p>
                          <p className="font-medium text-amber-500 text-xs">
                            R$ {srv.priceInCents / 100}
                          </p>
                        </div>
                        <IconBadge
                          icon={<ChevronRight size={16} />}
                          variant="muted"
                          size="sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom App Nav */}
                <div className="absolute right-6 bottom-6 left-6 flex h-16 items-center justify-around rounded-2xl border border-zinc-700 bg-zinc-800 px-4">
                  <div className="flex flex-col items-center text-amber-500">
                    <CalendarClock size={20} />
                    <span className="mt-1 font-medium text-[10px]">
                      Agendar
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-zinc-500">
                    <Scissors size={20} />
                    <span className="mt-1 font-medium text-[10px]">
                      Serviços
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-zinc-500">
                    <UserCheck size={20} />
                    <span className="mt-1 font-medium text-[10px]">Perfil</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
