import { baseUrlBlob } from "@/lib/consts";

export const imagePaths = {
  logoQuadrada: "/logo-quadrada.png",
  logoRedonda: "/logo-redonda.png",
  authBackground: "/auth-background.png",
  barberBanner: "/banner-barber-lucas.jpg",
  map: "/map.png",
  defaultAvatar: "/default-avatar.png",
  closed: "/closed.png",
  dividerDown: "/divider_down.png",
  backgroundMail: "/backgroundMail.jpg",
} as const;

export const emailImagePaths = {
  closed: `${baseUrlBlob}/templates-email/closed.png`,
  dividerDown: `${baseUrlBlob}/templates-email/divider_down.png`,
  backgroundMail: `${baseUrlBlob}/templates-email/backgroundMail.jpg`,
} as const;
