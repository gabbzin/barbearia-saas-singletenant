import type { Metadata } from "next";
import { Geist, Inter, Manrope } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";
import { getInfosBarbershop } from "@/shared/actions/get-infos-barbershop";
import QueryProvider from "../providers/query-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const info = await getInfosBarbershop();
  return {
    title: info?.name ?? "Barbearia",
    description: "Agende seu horário na melhor barbearia da cidade!",
    icons: {
      icon: info?.imageUrl,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${manrope.variable} ${geist.variable} antialiased`}
      >
        <QueryProvider>
          {children}
          <Toaster />
          <SpeedInsights />
        </QueryProvider>
      </body>
    </html>
  );
}
