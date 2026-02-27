import { History, Plus, User } from "lucide-react";
import { Button } from "../components/ui/button";

export function ClientNavs() {
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
      icon: History,
      label: "Histórico",
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
  ];

  return (
    <div className="mb-10 grid grid-cols-4 gap-3">
      {actions.map((action, idx) => (
        <Button
          // biome-ignore lint/suspicious/noArrayIndexKey: <Relaxe>
          key={idx}
          variant={"secondary"}
          size="card"
          className="group flex flex-col items-center justify-center gap-3 rounded-2xl p-4 backdrop-blur-2xl transition-all duration-300 hover:bg-primary/10"
        >
          <div
            className={`${action.bg} ${action.color} rounded-xl p-3 transition-transform group-hover:scale-110`}
          >
            <action.icon size={22} />
          </div>
          <span className="font-semibold text-xs sm:text-sm">
            {action.label}
          </span>
        </Button>
      ))}
    </div>
  );
}
