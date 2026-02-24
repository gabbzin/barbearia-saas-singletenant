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
  return (
    <div>
      <Avatar className={size ? `size-${size}` : "size-12"}>
        <AvatarImage
          src={imageUrl || ""}
          className={
            enabledGoldEffect
              ? "rounded-full border-2 border-foreground object-cover shadow-gold/20 shadow-lg dark:border-gold"
              : "rounded-full object-cover"
          }
        />
        <AvatarFallback>{initial}</AvatarFallback>
      </Avatar>
    </div>
  );
}
