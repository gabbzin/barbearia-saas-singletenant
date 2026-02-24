import { redirect } from "next/navigation";
import { verifySession } from "@/features/user/repository/user.repository";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const session = await verifySession();

  if (!session) {
    return redirect("/login");
  }

  return <>{children}</>;
}
