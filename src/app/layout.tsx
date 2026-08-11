import type { Metadata } from "next";
import { Archivo, Archivo_Black } from "next/font/google";
import { siteUrl } from "@/lib/siteUrl";
import "./globals.css";

const sans = Archivo({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const display = Archivo_Black({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: "Builder Pass — Hacker House Goa 2026",
  description:
    "Mint your Hacker House Goa 2026 Builder Pass. Upload a photo, get a shareable badge in seconds. Build. Ship. Sunset.",
  openGraph: {
    title: "Builder Pass — Hacker House Goa 2026",
    description:
      "Mint your Hacker House Goa 2026 Builder Pass. Build. Ship. Sunset.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${display.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
