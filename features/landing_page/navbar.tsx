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
      className={`fixed z-50 w-full bg-foreground py-6 transition-all duration-300`}
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
            <Button variant={"gold"} className="font-bold">
              <Link href="/login">Fazer Login</Link>
            </Button>
            <Button variant={"default"} className="hidden font-bold md:block">
              <Link href="/login">Agendar Agora</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
