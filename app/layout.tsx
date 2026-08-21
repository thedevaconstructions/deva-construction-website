import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MotionProvider } from "@/components/motion-provider";
import { MainShell } from "@/components/main-shell";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "600"],
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
  themeColor: "#F1EAE1",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-paper text-ink">
        <MotionProvider>
          <SiteHeader />
          <MainShell>{children}</MainShell>
          <SiteFooter />
        </MotionProvider>
      </body>
    </html>
  );
}
