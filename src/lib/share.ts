import type { Metadata } from "next";
import shareCard from "@/app/opengraph-image.jpg";

export const SITE_NAME = "Harshraj & Archana";

/** The share card, for routes that set their own openGraph (the root route picks it up from the file convention). */
export const SHARE_IMAGE = {
  url: shareCard.src,
  width: shareCard.width,
  height: shareCard.height,
  alt: "Harshraj & Archana · शुभ विवाह — Lagun & Phaldan on 19 November 2026 and the wedding on 25 November 2026, Bhind",
};

export const SHARE_DESCRIPTION = {
  en: "सादर आमंत्रण · Lagun & Phaldan: Thu 19 Nov, 5 PM · Shubh Vivah: Wed 25 Nov · Banke Bihari Marriage Garden, Bhind",
  hi: "हर्षराज & अर्चना का शुभ विवाह · लगुन व फलदान: गुरुवार 19 नवंबर, सायं 5 बजे · शुभ विवाह: बुधवार 25 नवंबर · बांके बिहारी मैरिज गार्डन, भिंड",
};

/**
 * Link-preview tags. The image comes from src/app/opengraph-image.jpg (designed at /og-card under
 * `next dev`). On Vercel its URL is made absolute automatically; on another host, set `metadataBase`.
 */
export function shareMetadata(title: string, description: string): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: { title, description, siteName: SITE_NAME, locale: "en_IN", type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}
