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
    </div>
  );
}
