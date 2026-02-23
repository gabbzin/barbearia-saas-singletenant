import { ScissorsIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

const Link = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return <a href={href}>{children}</a>;
};

const Links: string[] = [
  "Como Funciona",
  "Serviços",
  "Benefícios",
  "Depoimentos",
];

export function Navbar() {
  return (
    <nav
      className={`fixed z-50 w-full bg-transparent py-6 transition-all duration-300`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex cursor-pointer items-center gap-2">
            <div className="rounded-xl bg-amber-500 p-2 text-zinc-950">
              <ScissorsIcon size={24} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-white text-xl tracking-tight">
              Barbearia<span className="text-amber-500">SaaS</span>
            </span>
          </div>
          <div className="hidden items-center space-x-8 md:flex">
            {Links.map(link => (
              <Link
                key={link}
                href={`#${link.toLowerCase().replace(/\s/g, "-")}`}
              >
                <span className="text-sm text-zinc-300 transition-colors hover:text-white">
                  {link}
                </span>
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Button>Fazer Login</Button>
            <Button>Agendar Agora</Button>
          </div>
          {/* <button className="font-medium text-sm text-white transition-colors hover:text-amber-500">
              Login
            </button>
            <button className="rounded-full bg-amber-500 px-6 py-2.5 font-semibold text-zinc-950 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all hover:scale-105 hover:bg-amber-400 active:scale-95">
              Agendar Agora
            </button> */}
        </div>
      </div>
    </nav>
  );
}
