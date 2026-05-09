import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import { UserProvider } from "@/contexts/user-context";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  weight: ["400", "600", "700", "900"],
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Atlas — Mundial 2026",
  description: "Chat · Polla · Álbum Panini · Atlas IA. El Mundial en tu grupo.",
  manifest: "/manifest.json",
  icons: {
    icon: "/atlas-favicon.png",
    apple: "/atlas-favicon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#090B19",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${barlowCondensed.variable} ${dmSans.variable}`}
    >
      <body className="min-h-screen bg-atlas-bg text-atlas-text">
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
