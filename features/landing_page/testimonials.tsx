import { StarIcon } from "lucide-react";
import Image from "next/image";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Carlos Eduardo",
    role: "Cliente há 1 ano",
    text: "Nunca mais esperei na fila. Chego no horário marcado, sento na cadeira e pronto. O app avisa quando está chegando a hora, sensacional!",
    rating: 5,
  },
  {
    id: 2,
    name: "Rafael Silva",
    role: "Cliente há 3 meses",
    text: "A facilidade de pagar pelo celular e já deixar tudo certo é absurda. Recomendo para todo mundo que não tem tempo a perder.",
    rating: 5,
  },
  {
    id: 3,
    name: "Marcos Vinícius",
    role: "Cliente há 6 meses",
    text: "Muito bom poder ver a agenda do meu barbeiro de confiança e escolher o horário que encaixa no meu almoço. Plataforma nota 10.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section
      id="depoimentos"
      className="relative overflow-hidden bg-foreground py-24"
    >
      {/* Decorative Blob */}
      <div className="pointer-events-none absolute top-20 -right-40 h-96 w-96 rounded-full bg-amber-500/10 blur-[100px]"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="mb-3 font-bold text-amber-500 text-sm uppercase tracking-wide">
            Avaliações
          </h2>
          <h3 className="font-bold text-3xl text-white md:text-4xl">
            O que nossos clientes dizem
          </h3>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map(test => (
            <div
              key={test.id}
              className="flex flex-col justify-between rounded-3xl border border-amber-500 bg-foreground p-8 transition-colors duration-300 hover:bg-zinc-900/30"
            >
              <div>
                <div className="mb-6 flex gap-1 text-amber-500">
                  {[...Array(test.rating)].map((_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <Não tem problema usar>
                    <StarIcon key={i} size={18} fill="currentColor" />
                  ))}
                </div>
                <p className="mb-8 text-lg text-zinc-300 leading-relaxed">
                  "{test.text}"
                </p>
              </div>
              <div className="flex items-center gap-4 border-zinc-800 border-t pt-6">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-zinc-800">
                  <Image
                    width={50}
                    height={50}
                    src={`https://i.pravatar.cc/150?img=${test.id + 50}`}
                    alt={test.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-white">{test.name}</p>
                  <p className="text-sm text-zinc-500">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
