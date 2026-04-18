import { redirect } from "next/navigation";
import { Cart } from "@/features/cart";
import { verifySession } from "@/features/user/repository/user.repository";

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

  return (
    <>
      <Cart />
      {children}
    </>
  );
}
