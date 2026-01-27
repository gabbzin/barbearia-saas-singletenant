import { notFound } from "next/navigation";
import { verifySession } from "@/features/user/repository/user.repository";

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

  return children;
}
