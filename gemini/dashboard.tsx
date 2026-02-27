"use client";
import {
  Award,
  Bell,
  Calendar,
  CalendarCheck,
  CalendarX2,
  ChevronRight,
  Clock,
  History,
  MapPin,
  MoreVertical,
  Plus,
  Scissors,
  Star,
  User,
} from "lucide-react";
import { useState } from "react";

// --- DADOS MOCKADOS (Simulando resposta de API) ---
const USER = {
  name: "Gabriel",
  avatar: "https://i.pravatar.cc/150?img=11",
  loyaltyPoints: 7,
  loyaltyMax: 10,
};

const NEXT_APPOINTMENT = {
  id: "ag-1029",
  service: "Corte + Barba",
  barber: {
    name: "Diego Silva",
    avatar: "https://i.pravatar.cc/150?img=33",
  },
  date: "Hoje, 23 Fev",
  time: "15:30",
  duration: "1h",
  location: "Agendabarber Matriz - Asa Sul",
};

const FEATURED_BARBERS = [
  {
    id: 1,
    name: "Diego Silva",
    specialty: "Fade & Barba",
    rating: 4.9,
    avatar: "https://i.pravatar.cc/150?img=33",
  },
  {
    id: 2,
    name: "Lucas Mendes",
    specialty: "Tesoura & Clássico",
    rating: 4.8,
    avatar: "https://i.pravatar.cc/150?img=53",
  },
  {
    id: 3,
    name: "Rafael Costa",
    specialty: "Colorimetria",
    rating: 5.0,
    avatar: "https://i.pravatar.cc/150?img=60",
  },
];

const RECENT_HISTORY = [
  {
    id: 101,
    service: "Corte Masculino",
    date: "10 Fev 2026",
    status: "Concluído",
    price: "45,00",
  },
  {
    id: 102,
    service: "Barba Completa",
    date: "25 Jan 2026",
    status: "Concluído",
    price: "35,00",
  },
  {
    id: 103,
    service: "Corte + Barba",
    date: "12 Jan 2026",
    status: "Cancelado",
    price: "75,00",
  },
];

// --- COMPONENTES DA UI ---

const Topbar = () => (
  <header className="sticky top-0 z-40 border-zinc-900 border-b bg-zinc-950/80 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
    <div className="mx-auto flex max-w-7xl items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-amber-500 bg-zinc-800 p-0.5 shadow-amber-500/20 shadow-lg">
          <img
            src={USER.avatar}
            alt="Avatar"
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        <div>
          <p className="font-medium text-xs text-zinc-400">Bom dia,</p>
          <h1 className="font-bold text-base text-white leading-tight sm:text-lg">
            {USER.name} 👋
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full border-2 border-zinc-950 bg-amber-500"></span>
        </button>
        <button className="hidden items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 font-medium text-sm text-zinc-300 transition-colors hover:bg-zinc-800 sm:flex">
          <User size={16} />
          Meu Perfil
        </button>
      </div>
    </div>
  </header>
);

const LoyaltyWidget = () => {
  const progress = (USER.loyaltyPoints / USER.loyaltyMax) * 100;

  return (
    <div className="relative mb-8 flex items-center gap-5 overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-950 p-5 shadow-lg">
      <div className="absolute -top-4 -right-4 rotate-12 text-amber-500/10">
        <Award size={100} />
      </div>

      <div className="relative z-10 shrink-0 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-500">
        <Award size={24} />
      </div>

      <div className="relative z-10 flex-1">
        <div className="mb-2 flex items-end justify-between">
          <div>
            <h3 className="font-bold text-sm text-white">
              Clube de Fidelidade
            </h3>
            <p className="text-xs text-zinc-400">
              Faltam {USER.loyaltyMax - USER.loyaltyPoints} cortes para 1
              grátis!
            </p>
          </div>
          <span className="font-black text-amber-500 text-sm">
            {USER.loyaltyPoints}/{USER.loyaltyMax}
          </span>
        </div>

        <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const NextAppointment = ({ hasAppointment, onToggle }) => {
  if (!hasAppointment) {
    return (
      <div className="mb-8 flex flex-col items-center justify-center rounded-3xl border border-zinc-800 border-dashed bg-zinc-900 p-8 text-center">
        <div className="mb-4 rounded-full bg-zinc-800/50 p-4 text-zinc-500">
          <CalendarX2 size={32} />
        </div>
        <h2 className="mb-2 font-bold text-lg text-white">
          Você ainda não tem horário marcado
        </h2>
        <p className="mb-6 max-w-sm text-sm text-zinc-400">
          Seu último corte foi há 15 dias. Que tal dar um trato no visual essa
          semana?
        </p>
        <button className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-bold text-zinc-950 shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-transform hover:scale-105 hover:bg-amber-400 active:scale-95">
          <Plus size={20} />
          Agendar Agora
        </button>
      </div>
    );
  }

  return (
    <div className="group relative mb-8 rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-1 shadow-xl">
      {/* Subtle border glow effect on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-500/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

      <div className="relative z-10 rounded-[22px] bg-zinc-950 p-5 sm:p-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 font-bold text-amber-500 text-xs">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500"></span>
              Próximo Agendamento
            </div>
            <h2 className="font-black text-2xl text-white">
              {NEXT_APPOINTMENT.service}
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-400">
              <Clock size={14} className="text-amber-500" />
              {NEXT_APPOINTMENT.duration} estimado
            </p>
          </div>

          <button className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white">
            <MoreVertical size={20} />
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-4 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-zinc-800 p-2.5 text-zinc-400">
              <CalendarCheck size={20} />
            </div>
            <div>
              <p className="font-medium text-xs text-zinc-500 uppercase tracking-wider">
                Data e Hora
              </p>
              <p className="font-bold text-sm text-white">
                {NEXT_APPOINTMENT.date} às {NEXT_APPOINTMENT.time}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-zinc-800 p-2.5 text-zinc-400">
              <MapPin size={20} />
            </div>
            <div>
              <p className="font-medium text-xs text-zinc-500 uppercase tracking-wider">
                Local
              </p>
              <p
                className="max-w-[150px] truncate font-bold text-sm text-white sm:max-w-full"
                title={NEXT_APPOINTMENT.location}
              >
                {NEXT_APPOINTMENT.location}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-zinc-800 border-t pt-5 sm:flex-row">
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <div className="h-10 w-10 overflow-hidden rounded-full bg-zinc-800">
              <img
                src={NEXT_APPOINTMENT.barber.avatar}
                alt={NEXT_APPOINTMENT.barber.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Profissional</p>
              <p className="font-bold text-sm text-white">
                {NEXT_APPOINTMENT.barber.name}
              </p>
            </div>
          </div>

          <div className="flex w-full items-center gap-2 sm:w-auto">
            <button className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 font-semibold text-sm text-white transition-colors hover:bg-zinc-800 sm:flex-none">
              Cancelar
            </button>
            <button className="flex-1 rounded-xl bg-amber-500 px-4 py-2.5 font-bold text-sm text-zinc-950 shadow-amber-500/20 shadow-lg transition-all hover:scale-105 hover:bg-amber-400 active:scale-95 sm:flex-none">
              Reagendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickActions = () => {
  const actions = [
    {
      icon: Plus,
      label: "Agendar",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      icon: User,
      label: "Barbeiros",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      icon: Scissors,
      label: "Serviços",
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    {
      icon: History,
      label: "Histórico",
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
  ];

  return (
    <div className="mb-10 grid grid-cols-4 gap-3">
      {actions.map((action, idx) => (
        <button
          key={idx}
          className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700"
        >
          <div
            className={`${action.bg} ${action.color} rounded-xl p-3 transition-transform group-hover:scale-110`}
          >
            <action.icon size={22} />
          </div>
          <span className="font-semibold text-xs text-zinc-300 group-hover:text-white sm:text-sm">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
};

const FeaturedBarbers = () => (
  <div className="mb-10">
    <div className="mb-4 flex items-end justify-between px-1">
      <h3 className="font-bold text-lg text-white">Nossos Profissionais</h3>
      <button className="flex items-center gap-1 font-medium text-amber-500 text-sm transition-colors hover:text-amber-400">
        Ver todos <ChevronRight size={16} />
      </button>
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {FEATURED_BARBERS.map(barber => (
        <div
          key={barber.id}
          className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 transition-colors hover:bg-zinc-800/50"
        >
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-zinc-800">
            <img
              src={barber.avatar}
              alt={barber.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="truncate font-bold text-white">{barber.name}</h4>
            <p className="mb-1.5 truncate text-xs text-zinc-500">
              {barber.specialty}
            </p>
            <div className="flex items-center gap-1 font-bold text-amber-500 text-xs">
              <Star size={12} fill="currentColor" />
              {barber.rating}
            </div>
          </div>
          <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 transition-colors group-hover:bg-amber-500 group-hover:text-zinc-950">
            <ChevronRight size={18} />
          </button>
        </div>
      ))}
    </div>
  </div>
);

const RecentHistory = () => (
  <div className="mb-10">
    <div className="mb-4 flex items-end justify-between px-1">
      <h3 className="font-bold text-lg text-white">Histórico Recente</h3>
      <button className="text-sm text-zinc-400 transition-colors hover:text-white">
        Ver completo
      </button>
    </div>

    <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">
      {RECENT_HISTORY.map((item, idx) => (
        <div
          key={item.id}
          className={`flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-zinc-800/30 ${
            idx !== RECENT_HISTORY.length - 1
              ? "border-zinc-800/50 border-b"
              : ""
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`rounded-xl p-3 ${
                item.status === "Concluído"
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-red-500/10 text-red-500"
              }`}
            >
              <Scissors size={20} />
            </div>
            <div>
              <p className="mb-0.5 font-bold text-sm text-white">
                {item.service}
              </p>
              <p className="text-xs text-zinc-500">{item.date}</p>
            </div>
          </div>

          <div className="flex flex-col items-end text-right">
            <p className="mb-1 font-bold text-sm text-white">R$ {item.price}</p>
            <span
              className={`rounded-full px-2 py-0.5 font-bold text-[10px] uppercase tracking-wider ${
                item.status === "Concluído"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-zinc-800 text-zinc-400"
              }`}
            >
              {item.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// --- COMPONENTE PRINCIPAL ---

export function Dashboard() {
  // Estado criado para você poder testar o visual de "Sem Agendamentos"
  // Mude para "false" para ver a tela de Empty State
  const [hasAppointment, setHasAppointment] = useState(true);

  return (
    <div className="min-h-screen bg-zinc-950 pb-20 font-sans text-zinc-100 selection:bg-amber-500/30 selection:text-amber-200 sm:pb-8">
      <Topbar />

      <main className="mx-auto mt-6 max-w-3xl px-4 sm:mt-8 sm:px-6">
        {/* Toggle para demonstração (Pode remover em produção) */}
        <div className="mb-4 flex justify-end">
          <label className="flex cursor-pointer items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300">
            <input
              type="checkbox"
              checked={hasAppointment}
              onChange={() => setHasAppointment(!hasAppointment)}
              className="accent-amber-500"
            />
            Simular com/sem agendamento
          </label>
        </div>

        <LoyaltyWidget />

        <NextAppointment
          hasAppointment={hasAppointment}
          onToggle={() => setHasAppointment(!hasAppointment)}
        />

        <QuickActions />

        <FeaturedBarbers />

        <RecentHistory />
      </main>

      {/* Navegação Mobile Inferior (Típico de SaaS PWA) */}
      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-between border-zinc-900 border-t bg-zinc-950/90 px-6 pt-2 pb-safe backdrop-blur-lg sm:hidden">
        <button className="flex flex-col items-center gap-1 p-2 text-amber-500">
          <Calendar size={20} />
          <span className="font-bold text-[10px]">Agenda</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-zinc-500 hover:text-zinc-300">
          <Scissors size={20} />
          <span className="font-medium text-[10px]">Serviços</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-zinc-500 hover:text-zinc-300">
          <User size={20} />
          <span className="font-medium text-[10px]">Perfil</span>
        </button>
      </nav>
    </div>
  );
}
