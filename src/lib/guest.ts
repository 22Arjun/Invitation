import { COUPLE, EVENTS, UI, VENUE, type Lang } from "@/content/wedding";
import { plain } from "@/components/ornaments/Split";

/**
 * Personal invitation links: /i/<token>, where the token carries the guest's name as the family
 * typed it, a salutation, "& family", and the language to greet them in. No guest list is stored.
 */

export type Salutation = "respected" | "dear" | "none";
export type Guest = { name: string; salutation: Salutation; family: boolean; lang: Lang };

const SAL_CODE: Record<Salutation, string> = { respected: "a", dear: "p", none: "n" };
const CODE_SAL: Record<string, Salutation> = { a: "respected", p: "dear", n: "none" };

export const SALUTATIONS: Record<Salutation, { hi: string; en: string }> = {
  respected: { hi: "आदरणीय", en: "Respected" },
  dear: { hi: "प्रिय", en: "Dear" },
  none: { hi: "", en: "" },
};

const DEVANAGARI = /[ऀ-ॿ]/;

/** A name typed in Devanagari gets the Hindi invitation; anything else, English. */
export const guessLang = (name: string): Lang => (DEVANAGARI.test(name) ? "hi" : "en");

export const cleanName = (name: string) =>
  name
    .replace(/[\u0000-\u001f\u007f<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);

function toBase64Url(text: string) {
  let binary = "";
  new TextEncoder().encode(text).forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(token: string) {
  const b64 = token.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(b64.padEnd(Math.ceil(b64.length / 4) * 4, "="));
  return new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)));
}

export function encodeGuest(guest: Guest) {
  return `${SAL_CODE[guest.salutation]}${guest.family ? 1 : 0}${guest.lang === "hi" ? "h" : "e"}${toBase64Url(cleanName(guest.name))}`;
}

export function decodeGuest(token: string): Guest | null {
  const salutation = CODE_SAL[token[0]];
  const family = token[1];
  const lang = token[2];
  if (!salutation || (family !== "0" && family !== "1") || (lang !== "h" && lang !== "e")) return null;
  try {
    const name = cleanName(fromBase64Url(token.slice(3)));
    return name ? { name, salutation, family: family === "1", lang: lang === "h" ? "hi" : "en" } : null;
  } catch {
    return null;
  }
}

/** "आदरणीय शर्मा जी सपरिवार" / "Respected Sharma ji & family". */
export function addressOf(guest: Guest, lang: Lang) {
  const salutation = SALUTATIONS[guest.salutation][lang];
  const family = guest.family ? UI.guest.family[lang] : "";
  return `${salutation ? `${salutation} ` : ""}${guest.name}${family}`;
}

/** The title WhatsApp shows in the link preview. */
export function previewTitle(guest: Guest) {
  return `${addressOf(guest, guest.lang)} — ${UI.guest.invited[guest.lang]}`;
}

/** The two dates guests need, each with its time where the card gives one. */
const MESSAGE_EVENTS = [
  { id: "lagun", label: "title", icon: "🌼" },
  { id: "panigrahan", label: "short", icon: "🪔" },
] as const;

/** The WhatsApp message the family sends, with the personal link in it. */
export function inviteMessage(guest: Guest, link: string) {
  const lang = guest.lang;
  const hi = lang === "hi";
  const couple = hi
    ? `*${COUPLE.groom.honorific.hi} ${COUPLE.groom.full.hi}* संग *${COUPLE.bride.honorific.hi} ${COUPLE.bride.full.hi}*`
    : `*${COUPLE.groom.full.en} & ${COUPLE.bride.full.en}*`;
  const events = MESSAGE_EVENTS.map(({ id, label, icon }) => {
    const e = EVENTS.find((event) => event.id === id)!;
    const time = e.time ? `, ${e.time[lang]}` : "";
    return `${icon} ${plain(e[label][lang])} — ${e.weekday[lang]}, ${e.day} ${e.month[lang]}${time}`;
  });
  const lines = hi
    ? [
        `🙏 ${addressOf(guest, "hi")},`,
        "",
        "श्री गणेश जी की कृपा एवं पूज्य बुज़ुर्गों के आशीर्वाद से",
        `${couple} के शुभ विवाह के मांगलिक अवसर पर आप सादर आमंत्रित हैं।`,
        "",
        ...events,
        `📍 ${VENUE.name.hi}, भिंड`,
        "",
        `आपका निमंत्रण पत्र: ${link}`,
        "",
        "कृपया वेबसाइट पर अपनी उपस्थिति अवश्य बताएँ।",
        "— समस्त राजावत परिवार",
      ]
    : [
        `🙏 ${addressOf(guest, "en")},`,
        "",
        "With the blessings of Shri Ganesh and our elders, the Rajawat family joyfully invites you",
        `to the wedding celebrations of ${couple}.`,
        "",
        ...events,
        `📍 ${VENUE.name.en}, Bhind`,
        "",
        `Your invitation: ${link}`,
        "",
        "Kindly let us know you're coming through the RSVP on the website.",
        "— The Rajawat family",
      ];
  return lines.join("\n");
}
