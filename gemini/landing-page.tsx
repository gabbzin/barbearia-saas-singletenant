import {
  BellRing,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Facebook,
  Instagram,
  MapPin,
  Menu,
  Scissors,
  ShieldCheck,
  Star,
  Twitter,
  UserCheck,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

// --- DADOS MOCKADOS (Simulando uma API) ---
const SERVICES = [
  {
    id: 1,
    name: "Corte Masculino",
    duration: "30 min",
    price: "45,00",
    popular: false,
  },
  {
    id: 2,
    name: "Barba Completa",
    duration: "30 min",
    price: "35,00",
    popular: false,
  },
  {
    id: 3,
    name: "Corte + Barba",
    duration: "1 hora",
    price: "75,00",
    popular: true,
  },
  {
    id: 4,
    name: "Pigmentação",
    duration: "45 min",
    price: "60,00",
    popular: false,
  },
];

const BENEFITS = [
  {
    icon: BellRing,
    title: "Lembretes Automáticos",
    desc: "Receba notificações no WhatsApp antes do seu horário.",
  },
  {
    icon: Clock,
    title: "Histórico de Cortes",
    desc: "Acesse seus serviços anteriores e repita com um clique.",
  },
  {
    icon: ShieldCheck,
    title: "Pagamento Seguro",
    desc: "Pague online via Pix ou Cartão e evite filas no caixa.",
  },
  {
    icon: XCircle,
    title: "Cancelamento Fácil",
    desc: "Imprevistos acontecem. Remarque ou cancele pelo app.",
  },
  {
    icon: Star,
    title: "Avaliação Real",
    desc: "Veja a nota dos profissionais e escolha o melhor para você.",
  },
  {
    icon: UserCheck,
    title: "Barbeiros Favoritos",
    desc: "Salve seus profissionais preferidos para agendamentos rápidos.",
  },
];

const TESTIMONIALS = [
  {
    id: 1,
    name: "Carlos Eduardo",
    role: "Cliente há 1 ano",
    text: "Nunca mais esperei na fila. Chego no horário marcado, sento na cadeira e pronto. O app avisa quando está chegando a hora, sensacional!",
    rating: 5,
  },
  {
    id: 2,
    name: "Rafael Silva",
    role: "Cliente há 3 meses",
    text: "A facilidade de pagar pelo celular e já deixar tudo certo é absurda. Recomendo para todo mundo que não tem tempo a perder.",
    rating: 5,
  },
  {
    id: 3,
    name: "Marcos Vinícius",
    role: "Cliente há 6 meses",
    text: "Muito bom poder ver a agenda do meu barbeiro de confiança e escolher o horário que encaixa no meu almoço. Plataforma nota 10.",
    rating: 5,
  },
];

// --- COMPONENTES DA PÁGINA ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed z-50 w-full transition-all duration-300 ${scrolled ? "border-zinc-800 border-b bg-zinc-950/80 py-4 backdrop-blur-md" : "bg-transparent py-6"}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex cursor-pointer items-center gap-2">
            <div className="rounded-xl bg-amber-500 p-2 text-zinc-950">
              <Scissors size={24} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-white text-xl tracking-tight">
              Agenda<span className="text-amber-500">barber</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden items-center space-x-8 md:flex">
            <a
              href="#como-funciona"
              className="font-medium text-sm text-zinc-300 transition-colors hover:text-amber-500"
            >
              Como Funciona
            </a>
            <a
              href="#servicos"
              className="font-medium text-sm text-zinc-300 transition-colors hover:text-amber-500"
            >
              Serviços
            </a>
            <a
              href="#beneficios"
              className="font-medium text-sm text-zinc-300 transition-colors hover:text-amber-500"
            >
              Benefícios
            </a>
            <a
              href="#depoimentos"
              className="font-medium text-sm text-zinc-300 transition-colors hover:text-amber-500"
            >
              Depoimentos
            </a>
            <button className="font-medium text-sm text-white transition-colors hover:text-amber-500">
              Login
            </button>
            <button className="rounded-full bg-amber-500 px-6 py-2.5 font-semibold text-zinc-950 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all hover:scale-105 hover:bg-amber-400 active:scale-95">
              Agendar Agora
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-300 hover:text-white"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 flex w-full flex-col space-y-4 border-zinc-800 border-b bg-zinc-900 px-4 py-4 shadow-xl md:hidden">
          <a href="#como-funciona" className="py-2 font-medium text-zinc-300">
            Como Funciona
          </a>
          <a href="#servicos" className="py-2 font-medium text-zinc-300">
            Serviços
          </a>
          <a href="#beneficios" className="py-2 font-medium text-zinc-300">
            Benefícios
          </a>
          <div className="my-2 h-px bg-zinc-800"></div>
          <button className="py-2 text-left font-medium text-white">
            Fazer Login
          </button>
          <button className="rounded-xl bg-amber-500 px-4 py-3 text-center font-bold text-zinc-950">
            Agendar Agora
          </button>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
      {/* Background Glows */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-amber-500/20 blur-[120px]"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-700/50 bg-zinc-800/50 px-4 py-2 font-medium text-amber-500 text-sm">
              <Star size={16} fill="currentColor" />
              <span>A revolução do agendamento chegou</span>
            </div>
            <h1 className="mb-6 font-bold text-5xl text-white leading-[1.1] tracking-tight lg:text-7xl">
              Agende seu corte em{" "}
              <span className="bg-gradient-to-r from-amber-400 to-yellow-600 bg-clip-text text-transparent">
                segundos.
              </span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-zinc-400 leading-relaxed lg:mx-0 lg:text-xl">
              Esqueça as ligações e filas de espera. Escolha seu barbeiro
              favorito, o melhor horário e garanta seu estilo com praticidade e
              rapidez direto do seu celular.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 px-8 py-4 font-bold text-lg text-zinc-950 shadow-[0_0_30px_rgba(245,158,11,0.25)] transition-all hover:scale-105 hover:bg-amber-400 active:scale-95 sm:w-auto">
                Agendar Meu Horário
                <ChevronRight size={20} />
              </button>
              <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 px-8 py-4 font-bold text-lg text-white transition-all hover:bg-zinc-800 sm:w-auto">
                Ver Profissionais
              </button>
            </div>

            <div className="mt-10 flex items-center justify-center gap-4 font-medium text-sm text-zinc-500 lg:justify-start">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className="h-10 w-10 overflow-hidden rounded-full border-2 border-zinc-950 bg-zinc-800"
                  >
                    <img
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt="User"
                      className="h-full w-full object-cover opacity-80"
                    />
                  </div>
                ))}
              </div>
              <p>
                Mais de{" "}
                <strong className="text-zinc-300">10.000 clientes</strong>
                <br />
                agendando todos os meses.
              </p>
            </div>
          </div>

          {/* App Mockup UI (CSS Based) */}
          <div className="perspective-1000 relative mx-auto w-full max-w-md flex-1">
            {/* Decorative elements around phone */}
            <div
              className="absolute top-10 -right-8 animate-bounce rounded-2xl border border-zinc-700 bg-zinc-800 p-4 shadow-2xl"
              style={{ animationDuration: "3s" }}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-amber-500/20 p-2">
                  <CheckCircle2 className="text-amber-500" size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm text-white">
                    Corte Confirmado
                  </p>
                  <p className="text-xs text-zinc-400">Hoje às 15:30</p>
                </div>
              </div>
            </div>

            {/* Phone Frame */}
            <div className="relative mx-auto h-[650px] w-full max-w-[320px] rotate-x-[5deg] rotate-y-[-5deg] transform overflow-hidden rounded-[2.5rem] border-[6px] border-zinc-800 bg-zinc-950 shadow-2xl shadow-amber-500/10">
              {/* Dynamic Island / Notch */}
              <div className="absolute inset-x-0 top-0 flex h-6 justify-center">
                <div className="h-6 w-32 rounded-b-3xl bg-zinc-950"></div>
              </div>

              {/* App Content */}
              <div className="flex h-full flex-col bg-zinc-900/50 p-6 pt-12">
                <header className="mb-8 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-400">Bem-vindo de volta,</p>
                    <p className="font-bold text-white text-xl">Thiago 👋</p>
                  </div>
                  <div className="h-12 w-12 overflow-hidden rounded-full border border-zinc-700 bg-zinc-800">
                    <img
                      src="https://i.pravatar.cc/150?img=11"
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </header>

                <div className="relative mb-6 overflow-hidden rounded-3xl border border-zinc-700 bg-gradient-to-br from-zinc-800 to-zinc-900 p-5">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Scissors size={64} />
                  </div>
                  <div className="mb-3 inline-block rounded-full bg-amber-500 px-3 py-1 font-bold text-xs text-zinc-950">
                    Próximo Agendamento
                  </div>
                  <h3 className="mb-1 font-bold text-lg text-white">
                    Corte + Barba
                  </h3>
                  <p className="mb-4 flex items-center gap-1 text-sm text-zinc-400">
                    <Clock size={14} /> Hoje, 15:30
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-zinc-700">
                      <img
                        src="https://i.pravatar.cc/150?img=33"
                        alt="Barber"
                        className="h-full w-full rounded-full object-cover"
                      />
                    </div>
                    <span className="font-medium text-sm text-zinc-300">
                      com Diego Barber
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  <h4 className="mb-4 font-bold text-white">
                    Escolha um serviço
                  </h4>
                  <div className="space-y-3">
                    {SERVICES.slice(0, 3).map(srv => (
                      <div
                        key={srv.id}
                        className="flex items-center justify-between rounded-2xl border border-zinc-700/50 bg-zinc-800/50 p-4"
                      >
                        <div>
                          <p className="font-bold text-sm text-white">
                            {srv.name}
                          </p>
                          <p className="font-medium text-amber-500 text-xs">
                            R$ {srv.price}
                          </p>
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-700 text-zinc-300">
                          <ChevronRight size={16} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom App Nav */}
                <div className="absolute right-6 bottom-6 left-6 flex h-16 items-center justify-around rounded-2xl border border-zinc-700 bg-zinc-800 px-4">
                  <div className="flex flex-col items-center text-amber-500">
                    <CalendarClock size={20} />
                    <span className="mt-1 font-medium text-[10px]">
                      Agendar
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-zinc-500">
                    <Scissors size={20} />
                    <span className="mt-1 font-medium text-[10px]">
                      Serviços
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-zinc-500">
                    <UserCheck size={20} />
                    <span className="mt-1 font-medium text-[10px]">Perfil</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  return (
    <section
      id="como-funciona"
      className="relative border-zinc-900 border-t bg-zinc-950 py-24"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-3 font-bold text-amber-500 text-sm uppercase tracking-wide">
            O Processo
          </h2>
          <h3 className="mb-6 font-bold text-3xl text-white md:text-5xl">
            Três passos para o seu novo visual.
          </h3>
          <p className="text-lg text-zinc-400">
            Criamos um fluxo focado em você. Sem perda de tempo, sem burocracia.
          </p>
        </div>

        <div className="relative grid gap-8 md:grid-cols-3">
          {/* Linha conectora desktop */}
          <div className="absolute top-1/2 right-[15%] left-[15%] z-0 hidden h-px -translate-y-1/2 bg-gradient-to-r from-zinc-800 via-amber-500/50 to-zinc-800 md:block"></div>

          {[
            {
              step: "01",
              icon: UserCheck,
              title: "Escolha o Profissional",
              desc: "Navegue pelos nossos barbeiros, veja avaliações e serviços oferecidos.",
            },
            {
              step: "02",
              icon: CalendarClock,
              title: "Selecione o Horário",
              desc: "Acesse a agenda em tempo real e clique no horário que melhor encaixa no seu dia.",
            },
            {
              step: "03",
              icon: CreditCard,
              title: "Confirme e Pague",
              desc: "Garanta sua vaga pagando online com segurança. Depois é só aparecer!",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="relative z-10 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 text-center backdrop-blur-sm transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="pointer-events-none absolute -top-4 -left-4 select-none font-black text-6xl text-zinc-800/30">
                {item.step}
              </div>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-500">
                <item.icon size={32} />
              </div>
              <h4 className="mb-3 font-bold text-white text-xl">
                {item.title}
              </h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ServicesAndPrices = () => {
  return (
    <section
      id="servicos"
      className="relative border-zinc-800 border-t bg-zinc-900 py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-end justify-between gap-6 md:flex-row">
          <div className="max-w-xl">
            <h2 className="mb-3 font-bold text-amber-500 text-sm uppercase tracking-wide">
              Tabela de Preços
            </h2>
            <h3 className="font-bold text-3xl text-white md:text-4xl">
              Serviços de excelência,
              <br />
              preços transparentes.
            </h3>
          </div>
          <p className="text-sm text-zinc-400 md:text-right">
            Preços podem variar de acordo com o profissional.
            <br />
            Consulte a disponibilidade no app.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map(srv => (
            <div
              key={srv.id}
              className={`group relative flex h-full flex-col rounded-3xl border bg-zinc-950 p-6 transition-all duration-300 hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] ${srv.popular ? "border-amber-500/30" : "border-zinc-800"}`}
            >
              {srv.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-3 py-1 font-bold text-xs text-zinc-950">
                  Mais Pedido
                </div>
              )}
              <div className="flex-1">
                <h4 className="mb-2 font-bold text-white text-xl">
                  {srv.name}
                </h4>
                <div className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
                  <Clock size={16} />
                  <span>Duração: {srv.duration}</span>
                </div>
              </div>
              <div className="mt-auto">
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-sm text-zinc-400">R$</span>
                  <span className="font-black text-3xl text-white">
                    {srv.price}
                  </span>
                </div>
                <button
                  className={`w-full rounded-xl py-3 font-bold transition-all ${srv.popular ? "bg-amber-500 text-zinc-950 hover:bg-amber-400" : "bg-zinc-800 text-white hover:bg-zinc-700"}`}
                >
                  Agendar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Benefits = () => {
  return (
    <section id="beneficios" className="bg-zinc-950 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-3 font-bold text-amber-500 text-sm uppercase tracking-wide">
            Por que usar o Agendabarber?
          </h2>
          <h3 className="mb-6 font-bold text-3xl text-white md:text-4xl">
            Feito para facilitar a sua vida.
          </h3>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((ben, idx) => (
            <div
              key={idx}
              className="group rounded-3xl border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:bg-zinc-800/50"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-zinc-800 p-3 text-zinc-400 transition-colors group-hover:bg-amber-500/10 group-hover:text-amber-500">
                  <ben.icon size={24} />
                </div>
                <div>
                  <h4 className="mb-2 font-bold text-lg text-white">
                    {ben.title}
                  </h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {ben.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  return (
    <section
      id="depoimentos"
      className="relative overflow-hidden bg-zinc-900 py-24"
    >
      {/* Decorative Blob */}
      <div className="pointer-events-none absolute top-20 -right-40 h-96 w-96 rounded-full bg-amber-500/10 blur-[100px]"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="mb-3 font-bold text-amber-500 text-sm uppercase tracking-wide">
            Avaliações
          </h2>
          <h3 className="font-bold text-3xl text-white md:text-4xl">
            O que nossos clientes dizem
          </h3>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map(test => (
            <div
              key={test.id}
              className="flex flex-col justify-between rounded-3xl border border-zinc-800 bg-zinc-950 p-8"
            >
              <div>
                <div className="mb-6 flex gap-1 text-amber-500">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>
                <p className="mb-8 text-lg text-zinc-300 leading-relaxed">
                  "{test.text}"
                </p>
              </div>
              <div className="flex items-center gap-4 border-zinc-800 border-t pt-6">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-zinc-800">
                  <img
                    src={`https://i.pravatar.cc/150?img=${test.id + 50}`}
                    alt={test.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-white">{test.name}</p>
                  <p className="text-sm text-zinc-500">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FinalCTA = () => {
  return (
    <section className="relative bg-zinc-950 py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-amber-500 to-yellow-700 p-10 text-center md:p-16">
          {/* Abstract shapes inside CTA */}
          <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full bg-black/10 blur-3xl"></div>

          <div className="relative z-10">
            <h2 className="mb-6 font-black text-3xl text-zinc-950 tracking-tight md:text-5xl">
              Pronto para dar aquele trato no visual?
            </h2>
            <p className="mx-auto mb-10 max-w-2xl font-medium text-lg text-zinc-900/80 md:text-xl">
              Baixe o app ou acesse pelo navegador. Em menos de 1 minuto seu
              próximo corte estará garantido.
            </p>
            <button className="mx-auto flex items-center gap-3 rounded-2xl bg-zinc-950 px-10 py-5 font-bold text-lg text-white shadow-2xl transition-all hover:scale-105 hover:bg-zinc-900 active:scale-95">
              <CalendarClock size={24} />
              Agendar Meu Horário Agora
            </button>
            <p className="mt-6 font-semibold text-sm text-zinc-900/70">
              Não requer cartão de crédito para baixar o app.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="border-zinc-900 border-t bg-zinc-950 pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 grid grid-cols-2 gap-12 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-6 flex items-center gap-2">
              <div className="rounded-lg bg-amber-500 p-1.5 text-zinc-950">
                <Scissors size={20} strokeWidth={2.5} />
              </div>
              <span className="font-bold text-white text-xl tracking-tight">
                Agenda<span className="text-amber-500">barber</span>
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
                <span>Disponível em mais de 50 cidades no Brasil.</span>
              </li>
              <li>contato@agendabarber.com.br</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-zinc-900 border-t pt-8 md:flex-row">
          <p className="text-sm text-zinc-600">
            © {new Date().getFullYear()} Agendabarber. Todos os direitos
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
};

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 selection:bg-amber-500/30 selection:text-amber-200">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <ServicesAndPrices />
        <Benefits />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
