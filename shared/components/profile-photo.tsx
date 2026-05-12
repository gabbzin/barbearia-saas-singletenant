import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface ProfilePhotoProps {
  imageUrl?: string | null;
  initial: string;
  size?: number;
  enabledGoldEffect?: boolean;
}

export function ProfilePhoto({
  imageUrl,
  initial,
  size,
  enabledGoldEffect,
}: ProfilePhotoProps) {
  const sizeClass = size && size > 0 ? `size-${size}` : "size-12";

  return (
    <div>
      <Avatar
        className={cn(
          sizeClass,
          enabledGoldEffect && "shadow-gold/20 shadow-lg",
        )}
      >
        <AvatarImage
          src={imageUrl || ""}
          className={
            enabledGoldEffect
              ? "rounded-full border-2 border-foreground object-cover dark:border-gold"
              : "rounded-full object-cover"
          }
        />
        <AvatarFallback>{initial}</AvatarFallback>
      </Avatar>
    </div>
  );
}
