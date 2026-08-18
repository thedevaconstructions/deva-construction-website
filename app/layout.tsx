import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Deva Construction — Design and Built to Elegance",
    template: "%s — Deva Construction",
  },
  description:
    "Deva Construction is a Bangalore-based residential and commercial construction firm. Design-led builds, transparent budgets, on-site management from foundation to handover.",
  metadataBase: new URL("https://devaconstruction.in"),
  openGraph: {
    title: "Deva Construction — Design and Built to Elegance",
    description:
      "Bangalore-based residential and commercial construction. Design-led builds, transparent budgets, on-site management from foundation to handover.",
    url: "https://devaconstruction.in",
    siteName: "Deva Construction",
    locale: "en_IN",
    type: "website",
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0F1114",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-paper text-ink">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
