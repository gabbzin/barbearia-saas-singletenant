import { notFound } from "next/navigation";
import { verifySession } from "@/features/user/repository/user.repository";
import { Header } from "@/shared/new_components/header";

interface ProtectedBarberLayoutProps {
  children: React.ReactNode;
}

export default async function ProtectedBarberLayout({
  children,
}: ProtectedBarberLayoutProps) {
  const session = await verifySession();

  // Usuário comum não pode acessar as rotas de barbeiro
  if (session?.role === "USER") {
    return notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">{children}</div>
    </div>
  );
}
