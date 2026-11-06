import type { Metadata } from "next";
import { decodeGuest, encodeGuest, previewTitle } from "@/lib/guest";
import { SHARE_DESCRIPTION, SHARE_IMAGE, shareMetadata } from "@/lib/share";
import { Site } from "@/components/Site";

/**
 * A personal invitation: /i/<token>. Each new link is rendered on its first visit and then kept,
 * so the guest's name is in the HTML that WhatsApp reads for the link preview.
 */
export function generateStaticParams() {
  return [{ token: encodeGuest({ name: "Sharma ji", salutation: "respected", family: true, lang: "en" }) }];
}

export async function generateMetadata({ params }: PageProps<"/i/[token]">): Promise<Metadata> {
  const guest = decodeGuest((await params).token);
  if (!guest) return { robots: { index: false, follow: false } };
  const title = previewTitle(guest);
  const share = shareMetadata(title, SHARE_DESCRIPTION[guest.lang]);
  // A route's own openGraph replaces the inherited one, image included, so the card is attached here.
  return {
    title,
    robots: { index: false, follow: false },
    openGraph: { ...share.openGraph, images: [SHARE_IMAGE] },
    twitter: { ...share.twitter, images: [SHARE_IMAGE] },
  };
}

export default async function InvitationFor({ params }: PageProps<"/i/[token]">) {
  // A damaged or hand-edited link still opens the invitation, just without the personal welcome.
  return <Site guest={decodeGuest((await params).token)} />;
}
