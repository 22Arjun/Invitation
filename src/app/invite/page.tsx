import type { Metadata } from "next";
import { InviteMaker } from "./InviteMaker";
import "./invite.css";

export const metadata: Metadata = {
  title: "निमंत्रण भेजें · Send invitations",
  robots: { index: false, follow: false },
};

/** For the family: make a personal invitation link for each guest and send it on WhatsApp. Not linked from the site. */
export default function InvitePage() {
  return <InviteMaker />;
}
