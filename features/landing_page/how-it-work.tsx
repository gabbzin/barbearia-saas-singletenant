import { CalendarClockIcon, CreditCardIcon, UserCheckIcon } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: UserCheckIcon,
    title: "Escolha o Profissional",
    desc: "Navegue pelos nossos barbeiros, veja avaliações e serviços oferecidos.",
  },
  {
    step: "02",
    icon: CalendarClockIcon,
    title: "Selecione o Horário",
    desc: "Acesse a agenda em tempo real e clique no horário que melhor encaixa no seu dia.",
  },
  {
    step: "03",
    icon: CreditCardIcon,
    title: "Confirme e Pague",
    desc: "Garanta sua vaga pagando online com segurança. Depois é só aparecer!",
  },
];

export function HowItWork() {
  return (
    <section
      id="como-funciona"
      className="relative border-zinc-900 border-t bg-foreground py-24"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-3 font-bold text-amber-500 text-sm uppercase tracking-wide">
            O Processo
          </h2>
          <h3 className="mb-6 font-bold text-3xl text-white md:text-5xl">
            Três passos para o seu novo visual.
          </h3>
          <p className="text-lg text-zinc-400">
            Criamos um fluxo focado em você. Sem perda de tempo, sem burocracia.
          </p>
        </div>

        <div className="relative grid gap-8 md:grid-cols-3">
          {/* Linha conectora desktop */}
          <div className="absolute top-1/2 right-[15%] left-[15%] z-0 hidden h-px -translate-y-1/2 bg-linear-to-r from-zinc-800 via-amber-500/50 to-zinc-800 md:block"></div>

          {steps.map((item) => (
            <div
              key={item.step}
              className="relative z-10 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 text-center backdrop-blur-sm transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="pointer-events-none absolute -top-8 -left-4 select-none font-black text-6xl text-white">
                {item.step}
              </div>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-500">
                <item.icon size={32} />
              </div>
              <h4 className="mb-3 font-bold text-white text-xl">
                {item.title}
              </h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
