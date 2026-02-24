"use client";

import { authClient } from "@/lib/auth-client";
import { LockIcon, LogOut, PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProfilePhoto } from "@/shared/components/profile-photo";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { ChangePasswordSheet } from "./change-password-sheet";
import { EditProfileSheet } from "./edit-profile-sheet";

interface UserProfileCardProps {
  name: string;
  email: string;
  imageUrl?: string | null;
}

export function UserProfileCard({
  name,
  email,
  imageUrl,
}: UserProfileCardProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  return (
    <Card className="w-full">
      <CardContent className="px-4">
        <div className="mb-4 flex items-center gap-4">
          <ProfilePhoto
            initial={name?.charAt(0).toUpperCase() ?? ""}
            imageUrl={imageUrl}
            size={16}
          />
          <div>
            <p className="font-semibold text-base">{name}</p>
            <p className="text-muted-foreground text-xs">{email}</p>
          </div>
        </div>

        <Separator className="mb-4" />

        <div className="flex flex-col gap-2">
          <EditProfileSheet name={name}>
            <Button variant="outline" className="w-full justify-start gap-3">
              <PencilIcon className="size-4" />
              Editar informações
            </Button>
          </EditProfileSheet>

          <ChangePasswordSheet>
            <Button variant="outline" className="w-full justify-start gap-3">
              <LockIcon className="size-4" />
              Alterar senha
            </Button>
          </ChangePasswordSheet>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 hover:bg-destructive/10 hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            Sair da conta
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
