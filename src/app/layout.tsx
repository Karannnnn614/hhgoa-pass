import type { Metadata } from "next";
import { Anton, DM_Sans, Roboto_Condensed } from "next/font/google";
import { siteUrl } from "@/lib/siteUrl";
import "./globals.css";

const sans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const display = Anton({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: "Builder Pass — Hacker House Goa 2026",
  description:
    "Mint your Hacker House Goa 2026 Builder Pass. Upload a photo, get a shareable badge in seconds. Build. Ship. Ascend.",
  openGraph: {
    title: "Builder Pass — Hacker House Goa 2026",
    description:
      "Mint your Hacker House Goa 2026 Builder Pass. Build. Ship. Ascend.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${display.variable} ${robotoCondensed.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

