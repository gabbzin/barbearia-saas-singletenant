import Link from "next/link";
import { LogoLink } from "@/shared/components/logo-link";
import { Button } from "@/shared/components/ui/button";

const navItems = [
  { label: "Serviços", href: "#services" },
  { label: "Galeria", href: "#gallery" },
  { label: "Equipe", href: "#team" },
  { label: "Localização", href: "#location" },
];

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-zinc-800/60 border-b bg-neutral-950/80 py-4 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-3">
          <LogoLink />
          <span className="font-poppins font-semibold text-2xl text-zinc-100 tracking-tight">
            Lucas Alves
          </span>
        </a>

        <div className="hidden items-center gap-10 md:flex">
          {navItems.map(item => (
            <a
              key={item.href}
              href={item.href}
              className="font-manrope font-medium text-sm text-zinc-300 tracking-wide transition-colors hover:border-amber-300 hover:border-b hover:text-amber-300"
            >
              {item.label}
            </a>
          ))}
        </div>

        <Button variant="gold" asChild className="px-6 font-semibold text-sm">
          <Link href="/login">Agendar Agora</Link>
        </Button>
      </div>
    </nav>
  );
}
