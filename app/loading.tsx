import { BARBERSHOPNAME } from "@/lib/consts";
import { MorphingText } from "@/shared/components/ui/morphing-text";

export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col justify-around blur-2xl bg-white/80">
      <MorphingText
        texts={["Carregando...", BARBERSHOPNAME, "Aguarde um momento..."]}
      />
    </main>
  );
}
