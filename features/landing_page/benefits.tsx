import {
  BellRing,
  Clock,
  ShieldCheck,
  Star,
  UserCheck,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";

const BENEFITS = [
  {
    icon: BellRing,
    title: "Lembretes Automáticos",
    desc: "Receba notificações no WhatsApp antes do seu horário.",
  },
  {
    icon: Clock,
    title: "Histórico de Cortes",
    desc: "Acesse seus serviços anteriores e repita com um clique.",
  },
  {
    icon: ShieldCheck,
    title: "Pagamento Seguro",
    desc: "Pague online via Pix ou Cartão e evite filas no caixa.",
  },
  {
    icon: XCircle,
    title: "Cancelamento Fácil",
    desc: "Imprevistos acontecem. Remarque ou cancele pelo app.",
  },
  {
    icon: Star,
    title: "Avaliação Real",
    desc: "Veja a nota dos profissionais e escolha o melhor para você.",
  },
  {
    icon: UserCheck,
    title: "Barbeiros Favoritos",
    desc: "Salve seus profissionais preferidos para agendamentos rápidos.",
  },
];

export function Benefits() {
  return (
    <section
      id="beneficios"
      className="border-zinc-800 border-t bg-foreground py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-3 font-bold text-amber-500 text-sm uppercase tracking-wide">
            Por que usar o BarbeariaSaaS?
          </h2>
          <h3 className="mb-6 font-bold text-3xl text-white md:text-4xl">
            Feito para facilitar a sua vida.
          </h3>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((ben) => (
            <Card
              key={ben.title}
              className="group rounded-3xl border border-amber-500/30 bg-foreground py-6 transition-colors hover:bg-zinc-800/50"
            >
              <CardContent className="flex items-start gap-4">
                <div className="rounded-2xl bg-zinc-800 p-3 text-zinc-400 transition-colors group-hover:bg-amber-500/10 group-hover:text-amber-500">
                  <ben.icon size={24} />
                </div>
                <div>
                  <h4 className="mb-2 font-bold text-lg text-white">
                    {ben.title}
                  </h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {ben.desc}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
