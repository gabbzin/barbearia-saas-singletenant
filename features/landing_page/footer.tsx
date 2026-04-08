import { RiWhatsappFill } from "@remixicon/react";
import { Clock3, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { LogoLink } from "@/shared/components/logo-link";
import { AuroraText } from "@/shared/components/ui/aurora-text";

const LINKS = [
  { href: "#services", label: "Servicos" },
  { href: "#gallery", label: "Galeria" },
  { href: "#team", label: "Equipe" },
  { href: "#location", label: "Localizacao" },
];

export function Footer() {
  return (
    <section id="location" className="bg-zinc-950 py-20 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-start gap-12 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
        <div>
          <h2 className="font-poppins font-semibold text-4xl text-zinc-100 leading-tight sm:text-5xl">
            Onde a elegância encontra
            <br />a{" "}
            <AuroraText colors={["#E6CF05", "#E68D00"]}>essência</AuroraText>
          </h2>

          <p className="mt-6 max-w-xl font-manrope text-lg text-zinc-300 leading-relaxed">
            Localizado no Nucleo Bandeirante, pronto para transformar sua rotina
            em uma experiencia premium em cada visita.
          </p>

          <div className="mt-10 space-y-5">
            <div className="flex items-start gap-3 text-zinc-300">
              <MapPin size={18} className="mt-0.5 text-amber-300" />
              <div className="font-manrope">
                <p className="font-semibold text-zinc-100">Endereco</p>
                <p className="text-sm">
                  Av. Central, Bloco 123 - Nucleo Bandeirante, Brasilia - DF
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-zinc-300">
              <Clock3 size={18} className="mt-0.5 text-amber-300" />
              <div className="font-manrope">
                <p className="font-semibold text-zinc-100">Funcionamento</p>
                <p className="text-sm">Segunda a Sabado: 09h as 20h</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-zinc-300">
              <Phone size={18} className="mt-0.5 text-amber-300" />
              <div className="font-manrope">
                <p className="font-semibold text-zinc-100">Contato</p>
                <p className="text-sm">+55 (61) 98765-4321</p>
              </div>
            </div>
          </div>

          <a
            href="https://wa.me/5561987654321"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-bold font-manrope text-sm text-white transition hover:brightness-110"
          >
            <RiWhatsappFill size={18} />
            Contatar via WhatsApp
          </a>
          <p className="mt-4 text-muted/50 text-xs">
            Agendamentos feitos apenas via sistema!
          </p>
        </div>

        <div className="flex h-105 items-center justify-center overflow-hidden rounded-2xl border border-zinc-700/70 bg-zinc-900">
          <iframe
            src={
              "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3837.802921438771!2d-47.963191624118636!3d-15.866952124747385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a2f518dea8eaf%3A0xd5d44598ae3ed60c!2sLUCAS%20ALVES%20SAL%C3%83O%20E%20BARBEARIA!5e0!3m2!1spt-BR!2sbr!4v1775690406994!5m2!1spt-BR!2sbr"
            }
            width={500}
            height={350}
            allowFullScreen={false}
            loading={"lazy"}
            referrerPolicy={"no-referrer-when-downgrade"}
            title={"Barbearia Local"}
            className="rounded-md border-0 bg-gold p-1"
          />
        </div>
      </div>

      <footer className="mt-20 border-zinc-800/70 border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <LogoLink />
              <span className="font-poppins font-semibold text-xl text-zinc-100">
                Lucas Alves
              </span>
            </div>
            <p className="font-manrope text-xs text-zinc-500 uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} Lucas Alves Salao e Barbearia
            </p>
          </div>

          <div className="flex flex-wrap gap-6">
            {LINKS.map(item => (
              <a
                key={item.href}
                href={item.href}
                className="font-manrope font-medium text-xs text-zinc-400 uppercase tracking-[0.2em] transition-colors hover:text-amber-300"
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/login"
              className="font-manrope font-medium text-xs text-zinc-400 uppercase tracking-[0.2em] transition-colors hover:text-amber-300"
            >
              Login
            </Link>
          </div>
        </div>
      </footer>
    </section>
  );
}
