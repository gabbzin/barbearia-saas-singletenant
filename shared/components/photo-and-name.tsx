import { imagePaths } from "@/shared/constants/images";
import { ProfilePhoto } from "./profile-photo";

interface PhotoAndNameProps {
  name: string;
  imageUrl?: string | null;
  emoji?: string;
  mutedPhrase?: string;
  sizePhoto?: number;
  enabledGoldEffect?: boolean;
  reverseText?: boolean;
}

export function PhotoAndName({
  name,
  imageUrl,
  emoji,
  mutedPhrase,
  sizePhoto,
  enabledGoldEffect,
  reverseText = false,
}: PhotoAndNameProps) {
  return (
    <div className="flex items-center gap-2">
      <ProfilePhoto
        imageUrl={imageUrl ?? imagePaths.defaultAvatar}
        initial={name?.substring(0, 1).toUpperCase() ?? "A"}
        size={sizePhoto}
        enabledGoldEffect={enabledGoldEffect}
      />
      <div
        className={`flex leading-none ${reverseText ? "flex-col-reverse" : "flex-col"}`}
      >
        {mutedPhrase && (
          <p className="text-muted-foreground text-xs">{mutedPhrase}</p>
        )}
        <h4 className="overflow-hidden text-ellipsis whitespace-nowrap font-sans font-semibold text-md max-[400px]:w-20 md:w-full">
          {name} {emoji && <span className="font-sans">{emoji}</span>}
        </h4>
      </div>
    </div>
  );
}
