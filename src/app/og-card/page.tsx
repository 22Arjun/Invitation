import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OgCard } from "./OgCard";

export const metadata: Metadata = { title: "Share card", robots: { index: false } };

/**
 * Design source for src/app/opengraph-image.jpg, the preview WhatsApp and others show when the link
 * is shared. It exists only under `next dev`; see the README for how to re-capture it.
 */
export default function OgCardPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <OgCard />;
}
