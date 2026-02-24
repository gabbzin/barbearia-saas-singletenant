"use client";

import { useBarbershopStore } from "@/stores/barbershop.store";

export default function Footer() {
  const yearAtual = new Date().getFullYear();
  const name = useBarbershopStore(s => s.barbershop?.name ?? "");

  return (
    <footer className="bottom-0 mt-7 flex w-full flex-col items-center justify-center bg-muted py-7">
      <div className="text-center text-foreground">
        &copy; {yearAtual} {name}.
      </div>
      <p className="text-center text-muted-foreground">
        Todos os direitos reservados.
      </p>
    </footer>
  );
}
