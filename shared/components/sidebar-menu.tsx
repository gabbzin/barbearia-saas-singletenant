"use client";

import type { Barber, User } from "@prisma/client";
import {
  CalendarIcon,
  CreditCardIcon,
  HomeIcon,
  LogIn,
  LogOut,
  type LucideIcon,
  MenuIcon,
  UserIcon,
  UserStar,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import CancelAlertDialog from "../../features/booking/components/cancel-booking-alert-dialog";
import {
  authRoutes,
  barberRoutes,
  clientRoutes,
  publicRoutes,
} from "../constants/routes";
import { ProfilePhoto } from "./profile-photo";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

interface Route {
  name: string;
  path: string;
  icon: LucideIcon;
}

const ROUTES: Route[] = [
  { name: "Início", path: clientRoutes.dashboard, icon: HomeIcon },
  // { name: "Barbeiros", path: , icon: ScissorsIcon },
  { name: "Agendamentos", path: clientRoutes.bookings, icon: CalendarIcon },
  { name: "Assinaturas", path: clientRoutes.signature, icon: CreditCardIcon },
  { name: "Perfil", path: publicRoutes.profile, icon: UserIcon },
];

// Rotas exclusivas de barbeiro
const BARBER_ROUTES: Route[] = [
  { name: "Dashboard", path: barberRoutes.dashboard, icon: HomeIcon },
  { name: "Agenda", path: barberRoutes.schedule, icon: CalendarIcon },
];

const ADMIN_ROUTES: Route[] = [
  { name: "Painel Administrativo", path: "/admin/painel", icon: UserStar },
];

interface SidebarMenuProps {
  barbers?: (Barber & { user: User | null })[];
  isSubscriber: boolean;
  role: string;
}

export const SidebarMenu = ({ isSubscriber, role }: SidebarMenuProps) => {
  const { data: session } = authClient.useSession();
  const { push } = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          push(authRoutes.login);
        },
      },
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <MenuIcon />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[85vw] max-w-92.5 gap-6 p-0">
        <SheetHeader className="px-5 py-4 text-left">
          <SheetTitle className="font-bold text-lg">Menu</SheetTitle>
        </SheetHeader>

        <Separator className="p-0.2" />

        <div>
          {session ? (
            <div className="flex items-center gap-3 px-5 pb-2">
              <ProfilePhoto
                imageUrl={session.user.image}
                initial={session.user.name?.charAt(0).toUpperCase() || "U"}
                size={12}
              />
              <div className="flex flex-col overflow-hidden overflow-ellipsis leading-tight">
                <p className="font-semibold text-base">{session.user.name}</p>
                <p className="text-muted-foreground text-xs">
                  {session.user.email}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between px-5 pb-3">
              <p className="font-semibold text-base">Olá. Faça seu login!</p>
              <Button
                onClick={() => push("/login")}
                size="sm"
                className="gap-2"
              >
                Login <LogIn className="size-4" />
              </Button>
            </div>
          )}
        </div>

        <Separator className="p-0.2" />

        {/* ROTAS */}
        {(role === "USER" || role === "ADMIN") && (
          <>
            <div className="flex w-full flex-col px-2">
              {ROUTES.map(route => (
                <Button
                  key={route.name}
                  variant="ghost"
                  className="w-full justify-start gap-3 rounded-full px-5 py-3"
                  asChild
                >
                  <Link href={route.path}>
                    <route.icon className="size-4" />
                    <span className="font-medium text-sm">{route.name}</span>
                  </Link>
                </Button>
              ))}
            </div>

            <Separator className="p-0.2" />
          </>
        )}

        {(role === "BARBER" || role === "ADMIN") && (
          <>
            <div className="flex w-full flex-col px-2">
              {BARBER_ROUTES.map(route => (
                <Button
                  key={route.name}
                  variant="ghost"
                  className="w-full justify-start gap-3 rounded-full px-5 py-3"
                  asChild
                >
                  <Link href={route.path}>
                    <route.icon className="size-4" />
                    <span className="font-medium text-sm">{route.name}</span>
                  </Link>
                </Button>
              ))}
            </div>
            <Separator className="p-0.2" />
          </>
        )}

        {role === "ADMIN" && (
          <>
            <div className="flex w-full flex-col px-2">
              {ADMIN_ROUTES.map(route => (
                <Button
                  key={route.name}
                  variant="ghost"
                  className="w-full justify-start gap-3 rounded-full px-5 py-3"
                  asChild
                >
                  <Link href={route.path}>
                    <route.icon className="size-4" />
                    <span className="font-medium text-sm">{route.name}</span>
                  </Link>
                </Button>
              ))}
            </div>
            <Separator className="p-0.2" />
          </>
        )}

        <div className="flex flex-col px-2">
          {isSubscriber && (
            <CancelAlertDialog
              handleCancel={() => {}}
              isLoading={false}
              title="Cancelar Assinatura"
              description={
                <span>
                  Tem certeza que deseja cancelar sua assinatura? Esta ação não
                  pode ser desfeita.
                  <br />
                  Observação: Sua assinatura permanecerá ativa até o final do
                  período pago.
                </span>
              }
              cancelButtonText="Não, manter assinatura"
            >
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 rounded-full px-5 py-3 hover:bg-destructive/75 hover:text-white"
              >
                <X className="size-4" />
                <span className="font-medium text-sm">Cancelar Assinatura</span>
              </Button>
            </CancelAlertDialog>
          )}

          {session && (
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 rounded-full px-5 py-3 hover:bg-destructive/75 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="size-4" />
              <span className="font-medium text-sm">Sair da conta</span>
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
