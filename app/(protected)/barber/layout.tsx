import { notFound } from "next/navigation";
import { verifySession } from "@/features/user/repository/user.repository";
import Header from "@/shared/components/header";
import Footer from "@/shared/components/footer";

interface ProtectedBarberLayoutProps {
  children: React.ReactNode;
}

export default async function ProtectedBarberLayout({
  children,
}: ProtectedBarberLayoutProps) {
  const session = await verifySession();

  if (!session || session.role === "USER") {
    return notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
