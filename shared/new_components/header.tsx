import { verifySession } from "@/features/user/repository/user.repository";
import { AnimatedThemeToggler } from "../components/ui/animated-theme-toggler";

export async function Header() {
  const user = await verifySession();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b-2 bg-background px-5 py-2">
      <h2 className="font-bold text-xl">Olá {user?.name}</h2>
      <div className="flex items-center gap-2">
        <AnimatedThemeToggler />
      </div>
    </header>
  );
}
