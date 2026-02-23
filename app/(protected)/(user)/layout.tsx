import { notFound, redirect } from "next/navigation";
import { verifySession } from "@/features/user/repository/user.repository";
import Header from "@/shared/components/header";
import Footer from "@/shared/components/footer";

interface ProtectedUserLayoutProps {
  children: React.ReactNode;
}

export default async function ProtectedUserLayout({
  children,
}: ProtectedUserLayoutProps) {
  const session = await verifySession();

  if (session?.role === "BARBER") {
    return redirect("/barber/dashboard");
  }

  return children;
}
