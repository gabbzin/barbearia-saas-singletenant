import { ProfilePhoto } from "../components/profile-photo";

interface PhotoAndNameProps {
  name: string;
  imageUrl?: string | null;
  emoji?: string;
  mutedPhrase?: string;
  sizePhoto?: number;
  enabledGoldEffect?: boolean;
}

export function PhotoAndName({
  name,
  imageUrl,
  emoji,
  mutedPhrase,
  sizePhoto,
  enabledGoldEffect,
}: PhotoAndNameProps) {
  return (
    <div className="flex items-center gap-2">
      <ProfilePhoto
        imageUrl={imageUrl ?? "/default-avatar.png"}
        initial={name?.substring(0, 1).toUpperCase() ?? "A"}
        size={sizePhoto}
        enabledGoldEffect={enabledGoldEffect}
      />
      <div className="flex flex-col leading-none">
        {mutedPhrase && (
          <p className="text-muted-foreground text-xs">{mutedPhrase}</p>
        )}
        <h2 className="font-sans font-semibold text-md">
          {name} {emoji && <span className="font-sans">{emoji}</span>}
        </h2>
      </div>
    </div>
  );
}
