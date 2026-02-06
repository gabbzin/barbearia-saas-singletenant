import { notFound, useRouter } from "next/navigation";
import { verifySession } from "@/features/user/repository/user.repository";

interface ProtectedUserLayoutProps {
  children: React.ReactNode;
}

export default async function ProtectedUserLayout({
  children,
}: ProtectedUserLayoutProps) {
  const session = await verifySession();
  const { push } = useRouter();

  // Usuário barbeiro não pode acessar as rotas de usuário comum
  if (session?.role === "BARBER") {
    return push("/barber/dashboard");
  }

  return children;
}
