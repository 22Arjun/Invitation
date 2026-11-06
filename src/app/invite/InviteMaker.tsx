"use client";

import { Fragment, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { UI, type Lang } from "@/content/wedding";
import { addressOf, cleanName, encodeGuest, guessLang, inviteMessage, SALUTATIONS, type Guest, type Salutation } from "@/lib/guest";
import { toMobile } from "@/lib/phone";

const subscribeNever = () => () => {};
/** The site's own address, so links work on whatever domain the site is deployed to. */
const useOrigin = () => useSyncExternalStore(subscribeNever, () => window.location.origin, () => "");

const SALUTATION_OPTIONS: { value: Salutation; hi: string; en: string }[] = [
  { value: "respected", ...SALUTATIONS.respected },
  { value: "dear", ...SALUTATIONS.dear },
  { value: "none", hi: "कोई नहीं", en: "None" },
];

const LANG_OPTIONS: { value: Lang; label: string }[] = [
  { value: "hi", label: "हिन्दी" },
  { value: "en", label: "English" },
];

/** Shows the message as WhatsApp will: *text* in bold. */
function WhatsAppText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*[^*\n]+\*)/).map((part, i) =>
        part.startsWith("*") && part.endsWith("*") ? <b key={i}>{part.slice(1, -1)}</b> : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  );
}

/** Hindi inside labels styled with wide letter-spacing; marked so the spacing can be reset for Devanagari. */
const Hi = ({ children }: { children: string }) => <span lang="hi">{children}</span>;

const WHATSAPP_ICON =
  "M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .3-3.4-.7-2.9-1.2-4.7-4.1-4.9-4.3-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.4 1.8 2.2 1.2 1.1 2.2 1.4 2.5 1.6.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l2 .9c.3.2.5.2.5.4.1.1.1.7-.1 1.3Z";

export function InviteMaker() {
  const origin = useOrigin();
  const nameInput = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [salutation, setSalutation] = useState<Salutation>("respected");
  const [family, setFamily] = useState(true);
  const [langChoice, setLangChoice] = useState<Lang | null>(null);
  const [phone, setPhone] = useState("");
  const [copied, setCopied] = useState(false);
  const [sentTo, setSentTo] = useState<string[]>([]);

  const clean = cleanName(name);
  // Until the family picks a language, a name typed in Devanagari means a Hindi invitation.
  const lang = langChoice ?? guessLang(clean);
  const guest: Guest | null = clean ? { name: clean, salutation, family, lang } : null;
  const link = guest ? `${origin}/i/${encodeGuest(guest)}` : "";
  const message = guest ? inviteMessage(guest, link) : "";
  const phoneInvalid = phone.length > 0 && phone.length !== 10;

  const send = (e: FormEvent) => {
    e.preventDefault();
    if (!guest || phoneInvalid) return;
    window.open(`https://wa.me/${phone ? `91${phone}` : ""}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    setSentTo((list) => [addressOf(guest, lang), ...list.filter((n) => n !== addressOf(guest, lang))].slice(0, 12));
  };

  const copy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copy this link", link);
    }
  };

  const nextGuest = () => {
    setName("");
    setPhone("");
    setLangChoice(null);
    nameInput.current?.focus();
  };

  return (
    <main className="maker">
      <header className="maker__head" data-theme="cream">
        <p className="eyebrow">
          For the Rajawat family · <Hi>राजावत परिवार के लिए</Hi>
        </p>
        <h1 className="maker__title">
          निमंत्रण भेजें <em>Send invitations</em>
        </h1>
        <p className="maker__lede" lang="hi">
          मेहमान का नाम लिखें और WhatsApp पर भेजें। लिंक के प्रीव्यू में उनका नाम दिखेगा, और वेबसाइट खुलते ही उनका स्वागत उनके नाम से होगा।
        </p>
        <p className="maker__lede">
          Type a guest&apos;s name and send it on WhatsApp. They&apos;ll see their name in the link preview, and the site will welcome them by name when it opens.
        </p>
      </header>

      <section className="maker__body" data-theme="wine">
        <form className="maker__form" onSubmit={send} noValidate>
          <div className="field">
            <input
              ref={nameInput}
              id="maker-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=" "
              autoComplete="off"
              enterKeyHint="send"
              maxLength={60}
            />
            <label htmlFor="maker-name">
              <Hi>मेहमान का नाम</Hi> · Guest&apos;s name
            </label>
          </div>
          <p className="maker__hint">e.g. शर्मा जी · मामा जी · Sharma ji · Ravi bhaiya</p>

          <fieldset className="maker__seg">
            <legend>
              <Hi>संबोधन</Hi> · Salutation
            </legend>
            <div className="maker__seg-row">
              {SALUTATION_OPTIONS.map((o) => (
                <label key={o.value}>
                  <input type="radio" name="salutation" checked={salutation === o.value} onChange={() => setSalutation(o.value)} />
                  <span>
                    <b lang="hi">{o.hi}</b>
                    <small>{o.en}</small>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="maker__toggle">
            <input type="checkbox" checked={family} onChange={(e) => setFamily(e.target.checked)} />
            <span>
              <b lang="hi">सपरिवार</b> · &amp; family
            </span>
          </label>

          <fieldset className="maker__seg">
            <legend>
              <Hi>निमंत्रण की भाषा</Hi> · Invitation language
            </legend>
            <div className="maker__seg-row maker__seg-row--two">
              {LANG_OPTIONS.map((o) => (
                <label key={o.value}>
                  <input type="radio" name="lang" checked={lang === o.value} onChange={() => setLangChoice(o.value)} />
                  <span>
                    <b lang={o.value}>{o.label}</b>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="field field--phone">
            <input
              id="maker-phone"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              placeholder=" "
              value={phone}
              onChange={(e) => setPhone(toMobile(e.target.value))}
              aria-invalid={phoneInvalid}
              aria-describedby="maker-phone-help"
            />
            <label htmlFor="maker-phone">
              <Hi>मोबाइल नंबर</Hi> · Mobile <span className="field__opt">(optional)</span>
            </label>
            <span className="field__prefix" aria-hidden="true">
              +91
            </span>
            <span id="maker-phone-help" className={phoneInvalid ? "field__error" : "maker__hint"}>
              {phoneInvalid
                ? "Please enter all 10 digits · पूरे 10 अंक लिखें"
                : "खाली छोड़ें तो WhatsApp में संपर्क चुनें · Leave empty to pick the contact in WhatsApp"}
            </span>
          </div>

          <div className="maker__actions">
            <button type="submit" className="btn btn--gold" disabled={!guest || phoneInvalid}>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path fill="currentColor" d={WHATSAPP_ICON} />
              </svg>
              <span>
                WhatsApp <Hi>पर भेजें</Hi> · Send
              </span>
            </button>
            <button type="button" className="btn" onClick={copy} disabled={!guest}>
              <span>{copied ? "Copied ✓" : <><Hi>लिंक कॉपी</Hi> · Copy link</>}</span>
            </button>
          </div>
          <button type="button" className="link-underline maker__next" onClick={nextGuest} disabled={!name && !phone}>
            <Hi>अगला मेहमान</Hi> · Next guest
          </button>
        </form>

        <aside className="maker__preview" aria-live="polite">
          <p className="eyebrow">
            <Hi>वेबसाइट पर स्वागत</Hi> · Their welcome
          </p>
          <div className="maker__greeting" lang={lang}>
            <p className="maker__greeting-om" lang="hi">
              {UI.invocation}
            </p>
            <p className="maker__greeting-name">{guest ? addressOf(guest, lang) : lang === "hi" ? "आदरणीय …" : "Respected …"}</p>
            <p className="maker__greeting-welcome">{UI.guest.welcome[lang]}</p>
          </div>

          <p className="eyebrow">
            WhatsApp <Hi>संदेश</Hi> · Message
          </p>
          <div className="maker__bubble">
            {message ? <WhatsAppText text={message} /> : "मेहमान का नाम लिखते ही संदेश यहाँ दिखेगा · The message appears here as you type a name."}
          </div>
          {link && (
            <a className="maker__link" href={link} target="_blank" rel="noopener noreferrer">
              {link}
            </a>
          )}

          {sentTo.length > 0 && (
            <div className="maker__sent">
              <p className="eyebrow">
                <Hi>इस बार भेजे</Hi> · Sent this session
              </p>
              <ul>
                {sentTo.map((n) => (
                  <li key={n}>✓ {n}</li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}
