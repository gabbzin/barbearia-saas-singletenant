import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface ProfilePhotoProps {
  imageUrl?: string | null;
  initial: string;
  size?: number;
}

export function ProfilePhoto({ imageUrl, initial, size }: ProfilePhotoProps) {
  return (
    <div className="relative">
      <Avatar className={size ? `size-${size}` : "size-12"}>
        <AvatarImage src={imageUrl || ""} />
        <AvatarFallback>{initial}</AvatarFallback>
      </Avatar>
      <span className="absolute -end-0.5 -bottom-0.5 size-3 rounded-full border-2 border-background bg-emerald-500" />
    </div>
  );
}
