import type { BarberService } from "@prisma/client";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

interface HeroProps {
  services: BarberService[];
}

export async function Hero({ services }: HeroProps) {
  const featuredServices = services.slice(0, 3);

  return (
    <section id="top" className="relative min-h-screen overflow-hidden pt-28">
      <div className="absolute inset-0">
        <Image
          fill
          priority
          src={
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDSm_26sx_XHUT4oLtEMIxuprMcCpWMz2YWGEBK0pBfxCbwPKZQb1fSZmVaFTC13NVPBwRr0b22GRqS3MvXuZI5MA_aO7CrnVHsFkYYNpPKSqDH4dOtClOhOWRldNuklGO2uegeM0vyycrOvqTz04tIZlzYBQv4MwlTyKkuSZgj3BSKUM0QlwFonBf0IXO3jgWJi9lVahxGKGCJwQz7dTbkWBCC7HxgQ46uZ-8TT1iuML3W-FUL7zPt9glHerW_rGEnyG32793UiYM"
          }
          alt="Interior de uma barbearia premium"
          className="object-cover grayscale"
        />
        <div className="absolute inset-0 bg-linear-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/40" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-4 pb-24 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pb-32">
        <div className="max-w-2xl">
          <span className="mb-6 block font-manrope font-semibold text-amber-300 text-xs uppercase tracking-[0.25em] sm:text-sm">
            Experiência Premium em Barbearia
          </span>

          <h1 className="font-poppins font-semibold text-5xl text-zinc-100 leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Lucas Alves
            <br />
            <span className="text-zinc-300">Salão e Barbearia</span>
          </h1>

          <p className="mt-6 max-w-xl font-manrope text-lg text-zinc-300 leading-relaxed">
            Elevamos sua confianca com estilo impecavel e atendimento de elite.
            A referencia em estetica masculina no Núcleo Bandeirante.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button variant="gold" size="xl" asChild className="font-bold">
              <Link href="/login">
                Agendar Agora
                <ChevronRight size={18} />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="xl"
              asChild
              className="border-zinc-600 bg-zinc-900/30 text-zinc-100 hover:bg-zinc-800/60"
            >
              <a href="#services">Conheça os serviços</a>
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-700/70 bg-zinc-900/70 p-6 backdrop-blur-xl sm:p-8">
          <p className="mb-5 font-poppins font-semibold text-xl text-zinc-100">
            Serviços em destaque
          </p>
          <div className="space-y-4">
            {featuredServices.map(service => (
              <div
                key={service.id}
                className="flex items-center justify-between rounded-xl border border-zinc-700 bg-zinc-950/70 px-4 py-3"
              >
                <div className="font-manrope">
                  <p className="font-semibold text-zinc-100">{service.name}</p>
                  <p className="text-sm text-zinc-400">
                    {service.durationInMinutes} min
                  </p>
                </div>
                <span className="font-bold text-amber-300">
                  R$ {(service.priceInCents / 100).toFixed(2).replace(".", ",")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
