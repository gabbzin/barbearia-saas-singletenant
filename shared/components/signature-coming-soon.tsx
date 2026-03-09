"use client";

import { Hammer, Settings, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";

export function SignatureComingSoon() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(old => {
        if (old === 100) {
          clearInterval(timer);
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(old + diff, 85);
      });
    }, 800);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-linear-to-b from-primary/10 via-background to-background" />

      <Card className="relative w-full max-w-xl border-border/80 bg-card/80 backdrop-blur-xl">
        <CardContent className="space-y-8 px-6 py-8 text-center sm:px-10 sm:py-10">
          <div className="flex items-center justify-center gap-4">
            <div className="relative">
              <Settings className="h-10 w-10 animate-[spin_4s_linear_infinite] text-primary" />
              <div className="absolute -right-2 -bottom-2 rounded-full bg-background p-1 shadow-sm">
                <Wrench className="h-5 w-5 text-primary" />
              </div>
            </div>
            <Hammer className="h-9 w-9 animate-pulse text-muted-foreground" />
          </div>

          <div className="space-y-3">
            <h1 className="font-extrabold text-2xl tracking-tight sm:text-3xl">
              Página de assinatura em desenvolvimento
            </h1>
            <p className="mx-auto max-w-md text-muted-foreground text-sm leading-relaxed sm:text-base">
              Estamos trabalhando para trazer uma experiência de assinatura
              incrível para o seu negócio. Em breve você poderá usar essa funcionalidade
            </p>
          </div>

          <div className="w-full">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-2.5 rounded-full bg-linear-to-r from-primary to-primary/70 transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-right font-medium text-muted-foreground text-xs">
              Progresso estimado...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
