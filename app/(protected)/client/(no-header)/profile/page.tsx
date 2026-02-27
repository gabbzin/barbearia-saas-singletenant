import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentSubscriptionAction } from "@/features/signature/actions/get-current-subscription";
import { AccountInfoCard } from "@/features/user/components/account-info-card";
import { UserProfileCard } from "@/features/user/components/user-profile-card";
import { verifySession } from "@/features/user/repository/user.repository";
import { prisma } from "@/lib/prisma";
import { AnimatedThemeToggler } from "@/shared/components/ui/animated-theme-toggler";
import { Button } from "@/shared/components/ui/button";
import { PageSection, PageSectionTitle } from "@/shared/components/ui/page";
import { clientRoutes } from "@/shared/constants/routes";

export default async function ProfilePage() {
  const user = await verifySession();

  if (!user) {
    redirect("/login");
  }

  const [plan, dbUser] = await Promise.all([
    getCurrentSubscriptionAction(),
    prisma.user.findUnique({
      where: { id: user.id },
      select: { createdAt: true },
    }),
  ]);

  return (
    <main className="flex flex-col gap-2">
      <PageSection>
        <div className="flex w-full items-center justify-between">
          <Button variant={"outline"} className="flex items-center gap-2">
            <Link href={clientRoutes.dashboard}>
              <ArrowLeft />
            </Link>
          </Button>
          <PageSectionTitle>Seu Perfil</PageSectionTitle>
          <AnimatedThemeToggler />
        </div>
        <UserProfileCard
          name={user.name ?? ""}
          email={user.email ?? ""}
          imageUrl={user.imageUrl}
        />
      </PageSection>

      <PageSection>
        <PageSectionTitle>Informações da conta</PageSectionTitle>
        <AccountInfoCard
          createdAt={dbUser?.createdAt ?? null}
          hasPlan={plan?.hasPlan ?? false}
          planName={plan?.name}
        />
      </PageSection>
    </main>
  );
}
