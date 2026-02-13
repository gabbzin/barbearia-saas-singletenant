import { SubscriptionStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { verifySession } from "@/features/user/repository/user.repository";
import { prisma } from "@/lib/prisma";

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
