import { SocialIcon } from "react-social-icons";

interface InstagramIconProps {
  url: string;
  network?: string;
  width?: number;
  height?: number;
}

export function SocialIconComponent({
  url,
  network,
  width,
  height,
}: InstagramIconProps) {
  return (
    <SocialIcon
      url={url}
      network={network}
      style={{
        width: width ?? 32,
        height: height ?? 32,
      }}
      className="rounded-md border-border"
      borderRadius="0"
      target="_blank"
    />
  );
}
