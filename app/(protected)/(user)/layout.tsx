import { notFound } from "next/navigation";
import { verifySession } from "@/features/user/repository/user.repository";

interface ProtectedUserLayoutProps {
  children: React.ReactNode;
}

export default async function ProtectedUserLayout({
  children,
}: ProtectedUserLayoutProps) {
  const session = await verifySession();

  // Usuário barbeiro não pode acessar as rotas de usuário comum
  if (session?.role === "BARBER") {
    return notFound();
  }

  return children;
}
