import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost, Pinyon_Script, Tiro_Devanagari_Hindi } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const jost = Jost({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-jost" });

const pinyon = Pinyon_Script({ subsets: ["latin"], weight: "400", variable: "--font-pinyon" });

const tiro = Tiro_Devanagari_Hindi({
  subsets: ["devanagari", "latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-tiro",
});

export const metadata: Metadata = {
  title: "Harshraj & Archana · शुभ विवाह · 25 November 2026",
  description:
    "The Rajawat family joyfully invites you to the wedding celebrations of Harshraj & Archana — 19 to 26 November 2026, Bhind, Madhya Pradesh.",
  // The share image is src/app/opengraph-image.jpg (designed at /og-card under `next dev`).
  // On Vercel its URL is made absolute automatically; on another host, set `metadataBase`.
  openGraph: {
    title: "Harshraj & Archana · शुभ विवाह",
    description: "सादर आमंत्रण · Lagun & Phaldan: Thu 19 Nov, 5 PM · Shubh Vivah: Wed 25 Nov · Banke Bihari Marriage Garden, Bhind",
    siteName: "Harshraj & Archana",
    locale: "en_IN",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#fbf4e8",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable} ${pinyon.variable} ${tiro.variable} is-locked`}>
      <body>{children}</body>
    </html>
  );
}
