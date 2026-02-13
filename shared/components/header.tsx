import { getBarbers } from "@/features/barber/services/barbers.repository";
import {
  getCurrentSubscription,
  verifySession,
} from "@/features/user/repository/user.repository";
import { LogoLink } from "./logo-link";
import { SidebarMenu } from "./sidebar-menu";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";

const Header = async () => {
  const barbers = await getBarbers();
  const isSubscriber = await getCurrentSubscription();
  const session = await verifySession();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b-2 bg-background px-5 py-2">
      <LogoLink />
      <div className="flex items-center gap-2">
        <AnimatedThemeToggler />
        <SidebarMenu
          barbers={barbers}
          isSubscriber={isSubscriber.hasPlan}
          role={session?.role ?? "USER"}
        />
      </div>
    </header>
  );
};

export default Header;
