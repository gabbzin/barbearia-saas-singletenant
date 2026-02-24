/** biome-ignore-all lint/a11y/useValidAnchor: <Depois eu vou alterar os links correspondentes> */
import {
  Facebook,
  Instagram,
  MapPin,
  Phone,
  Scissors,
  Twitter,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="border-zinc-900 border-t bg-foreground pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 grid grid-cols-2 gap-12 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-6 flex items-center gap-2">
              <div className="rounded-lg bg-amber-500 p-1.5 text-zinc-950">
                <Scissors size={20} strokeWidth={2.5} />
              </div>
              <span className="font-bold text-white text-xl tracking-tight">
                Barbearia<span className="text-amber-500">SaaS</span>
              </span>
            </div>
            <p className="mb-6 text-sm text-zinc-500 leading-relaxed">
              A plataforma definitiva para clientes que valorizam seu tempo e
              estilo. Agende cortes com os melhores barbeiros da sua região.
            </p>
            <div className="flex gap-4 text-zinc-400">
              <a href="#" className="transition-colors hover:text-amber-500">
                <Instagram size={20} />
              </a>
              <a href="#" className="transition-colors hover:text-amber-500">
                <Twitter size={20} />
              </a>
              <a href="#" className="transition-colors hover:text-amber-500">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-6 font-bold text-white">Plataforma</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li>
                <a
                  href="#como-funciona"
                  className="transition-colors hover:text-amber-500"
                >
                  Como funciona
                </a>
              </li>
              <li>
                <a
                  href="#servicos"
                  className="transition-colors hover:text-amber-500"
                >
                  Serviços e Preços
                </a>
              </li>
              <li>
                <a
                  href="#beneficios"
                  className="transition-colors hover:text-amber-500"
                >
                  Benefícios
                </a>
              </li>
              <li>
                <a
                  href="#depoimentos"
                  className="transition-colors hover:text-amber-500"
                >
                  Depoimentos
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-bold text-white">Suporte</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li>
                <a href="#" className="transition-colors hover:text-amber-500">
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-amber-500">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-amber-500">
                  Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-amber-500">
                  Fale Conosco
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-bold text-white">Contato</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-1 shrink-0 text-amber-500" />
                <span>Disponível em qualquer cidade no Brasil.</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="mt-1 shrink-0 text-amber-500" />
                <span>Contrate já para a sua barbearia.</span>
              </li>
              <li>contato@barbeariasaas.com.br</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-zinc-900 border-t pt-8 md:flex-row">
          <p className="text-sm text-zinc-600">
            © {new Date().getFullYear()} Barbearia SaaS. Todos os direitos
            reservados.
          </p>
          <div className="flex gap-6 text-sm text-zinc-600">
            <a href="#" className="transition-colors hover:text-white">
              Termos
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Privacidade
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
