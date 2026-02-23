import { getInfosBarbershop } from "@/shared/actions/get-infos-barbershop";
import { MorphingText } from "@/shared/components/ui/morphing-text";

export default async function Loading() {
  const info = await getInfosBarbershop();
  const name = info?.name ?? "";

  return (
    <main className="flex min-h-screen flex-col justify-around bg-white/80 blur-2xl">
      <MorphingText texts={["Carregando...", name, "Aguarde um momento..."]} />
    </main>
  );
}
