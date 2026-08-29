import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MotionProvider } from "@/components/motion-provider";
import { BgShader } from "@/components/bg-shader";
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
    default: "Deva Construction — Building with Precision. Delivering with Trust.",
    template: "%s — Deva Construction",
  },
  description:
    "Deva Construction is a Bangalore-based construction firm building residential, commercial, and renovation projects with end-to-end site management — foundation to handover, every trade under one roof.",
  metadataBase: new URL("https://devaconstructions.in"),
  openGraph: {
    title: "Deva Construction — Building with Precision. Delivering with Trust.",
    description:
      "Bangalore-based construction firm specialising in residential homes, commercial spaces, and renovation — from foundation to handover.",
    url: "https://devaconstructions.in",
    siteName: "Deva Construction",
    locale: "en_IN",
    type: "website",
    // Without this, every share of the site — and in this trade that means
    // WhatsApp — renders as a bare text box. Cropped from a walkthrough frame
    // rather than a logo card, so the preview shows the work.
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Interior of a Deva Construction build, exposed structural ceiling above a level threshold",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Deva Construction — Building with Precision. Delivering with Trust.",
    description:
      "Bangalore-based construction firm specialising in residential homes, commercial spaces, and renovation — from foundation to handover.",
    images: ["/og.jpg"],
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
};

/**
 * Regenerate every page at least once a day.
 *
 * The footer renders `new Date().getFullYear()` in a server component, so on
 * a fully static page the year is frozen at build time — /about, /services
 * and /contact would have kept saying 2026 into January. Pages that set a
 * shorter window (the showcase pages use 60s) override this.
 */
export const revalidate = 86400;

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
      <body className="min-h-screen text-ink">
        {/* Fixed WebGL background, behind everything. Mounted once here so the
            whole site shares one GL context. */}
        <BgShader />
        <MotionProvider>
          <SiteHeader />
          <MainShell>{children}</MainShell>
          <SiteFooter />
        </MotionProvider>
      </body>
    </html>
  );
}
