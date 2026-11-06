"use client";

import Image from "next/image";
import { useRef, useState, type FormEvent } from "react";
import { COUPLE, EVENTS, RSVP_WHATSAPP, UI, type Lang } from "@/content/wedding";
import { gsap, useGSAP } from "@/lib/gsap";
import { useLang } from "@/lib/lang";
import { burstPetals } from "@/lib/petals";
import { scrollToTarget } from "@/lib/scroll";
import { Mandala } from "@/components/ornaments/Mandala";
import { Rich, Split, plain } from "@/components/ornaments/Split";

type Attending = "" | "yes" | "no";
type Form = { name: string; phone: string; attending: Attending; guests: number; events: string[]; message: string };
type Errors = Partial<Record<"name" | "phone" | "attending", string>>;

const EMPTY: Form = { name: "", phone: "", attending: "", guests: 1, events: EVENTS.map((e) => e.id), message: "" };

/** Keeps the 10-digit Indian mobile number, whatever was typed, pasted or autofilled ("+91 98765-43210", "098765…"). */
function toMobile(raw: string) {
  let digits = raw.replace(/\D/g, "");
  if (digits.length > 10 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length > 10 && digits.startsWith("0")) digits = digits.slice(1);
  return digits.slice(0, 10);
}
const S = UI.rsvpSection;

function compose(form: Form, lang: Lang) {
  const tx = (o: Record<Lang, string>) => o[lang];
  const couple = lang === "hi" ? `${COUPLE.groom.name.hi} एवं ${COUPLE.bride.name.hi}` : `${COUPLE.groom.name.en} & ${COUPLE.bride.name.en}`;
  const events = EVENTS.filter((e) => form.events.includes(e.id))
    .map((e) => `• ${plain(tx(e.title))} (${e.day} ${tx(e.month)})`)
    .join("\n");
  const lines =
    lang === "hi"
      ? [
          `🙏 *${couple} — शुभ विवाह* · उपस्थिति`,
          "",
          `नाम: ${form.name}`,
          `फ़ोन: +91 ${form.phone}`,
          form.attending === "yes" ? `उत्तर: अवश्य पधारेंगे (${form.guests} सदस्य)` : "उत्तर: दूर से आशीर्वाद",
          ...(form.attending === "yes" && events ? ["", "कार्यक्रम:", events] : []),
          ...(form.message ? ["", `आशीर्वाद: ${form.message}`] : []),
        ]
      : [
          `🙏 *${couple} — Shubh Vivah* · RSVP`,
          "",
          `Name: ${form.name}`,
          `Phone: +91 ${form.phone}`,
          form.attending === "yes" ? `Reply: Joyfully attending (${form.guests} ${form.guests === 1 ? "guest" : "guests"})` : "Reply: Sending blessings from afar",
          ...(form.attending === "yes" && events ? ["", "Ceremonies:", events] : []),
          ...(form.message ? ["", `Blessings: ${form.message}`] : []),
        ];
  return lines.join("\n");
}

export function Rsvp() {
  const { lang, t } = useLang();
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<{ link: string; name: string; attending: Attending } | null>(null);
  const root = useRef<HTMLElement>(null);
  const submit = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      if (!sent) return;
      gsap.from(".rsvp__thanks > *", { autoAlpha: 0, y: 30, stagger: 0.1, duration: 1.2, ease: "expo.out" });
      gsap.fromTo(
        ".rsvp__thanks-mandala path, .rsvp__thanks-mandala circle, .rsvp__thanks-mandala line",
        { strokeDasharray: 1, strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 2.4, ease: "power2.inOut", stagger: { amount: 1 } },
      );
      const panel = root.current?.querySelector<HTMLElement>(".rsvp__panel");
      if (panel && panel.getBoundingClientRect().top < 80) scrollToTarget(panel.getBoundingClientRect().top + window.scrollY - 120);
      root.current?.querySelector<HTMLElement>(".rsvp__thanks")?.focus({ preventScroll: true });
    },
    { scope: root, dependencies: [sent] },
  );

  const update = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const toggleEvent = (id: string) =>
    update("events", form.events.includes(id) ? form.events.filter((e) => e !== id) : [...form.events, id]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next: Errors = {};
    if (!form.name.trim()) next.name = t(S.required);
    if (!form.phone) next.phone = t(S.required);
    else if (form.phone.length !== 10) next.phone = t(S.phoneInvalid);
    if (!form.attending) next.attending = t(S.choose);
    setErrors(next);
    if (Object.keys(next).length) {
      // Focus the first problem straight away (the DOM hasn't re-rendered with aria-invalid yet),
      // so on a phone the right keyboard comes back up without another tap.
      const first = next.name ? "#rsvp-name" : next.phone ? "#rsvp-phone" : "input[name='attending']";
      e.currentTarget.querySelector<HTMLElement>(first)?.focus();
      return;
    }
    const link = `https://wa.me/${RSVP_WHATSAPP}?text=${encodeURIComponent(compose(form, lang))}`;
    window.open(link, "_blank", "noopener,noreferrer");
    const r = submit.current?.getBoundingClientRect();
    if (r) burstPetals(r.left + r.width / 2, r.top + r.height / 2, 130);
    navigator.vibrate?.([14, 60, 14]);
    setSent({ link, name: form.name.trim().split(/\s+/)[0], attending: form.attending });
  };

  const thanksTitle = sent ? t(sent.attending === "yes" ? S.thanksTitleYes : S.thanksTitleNo).replace("{name}", sent.name) : "";

  return (
    <section ref={root} id="rsvp" className="rsvp" data-theme="wine">
      <div className="rsvp__grid">
        <div className="rsvp__side">
          <p className="eyebrow" data-reveal="fade">
            {t(S.eyebrow)}
          </p>
          <h2 className="display display--sm" data-reveal="split">
            <Split text={t(S.title)} />
          </h2>
          <p className="lede" data-reveal="fade">
            {t(S.lede)}
          </p>
          <figure className="rsvp__arch">
            <div className="rsvp__arch-inner" data-reveal="image">
              <Image src="/images/rsvp.jpg" alt="" fill sizes="(max-width: 900px) 70vw, 30vw" />
            </div>
          </figure>
        </div>

        <div className="rsvp__panel">
          {sent ? (
            <div className="rsvp__thanks" tabIndex={-1} role="status">
              <Mandala className="rsvp__thanks-mandala" />
              <p className="rsvp__thanks-title">{thanksTitle}</p>
              <p className="rsvp__thanks-text">{t(sent.attending === "yes" ? S.thanksYes : S.thanksNo)}</p>
              <div className="rsvp__thanks-actions">
                <a className="btn btn--gold" href={sent.link} target="_blank" rel="noopener noreferrer" data-magnetic>
                  <span>{t(S.openWhatsApp)}</span>
                  <i aria-hidden="true">↗</i>
                </a>
                <button type="button" className="link-underline" onClick={() => setSent(null)}>
                  {t(S.edit)}
                </button>
              </div>
            </div>
          ) : (
            <form className="rsvp__form" noValidate onSubmit={onSubmit} data-reveal="stagger">
              <div className="field">
                <input
                  id="rsvp-name"
                  name="name"
                  autoComplete="name"
                  placeholder=" "
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby="rsvp-name-error"
                />
                <label htmlFor="rsvp-name">{t(S.name)}</label>
                <span id="rsvp-name-error" className="field__error">
                  {errors.name}
                </span>
              </div>
              <div className="field field--phone">
                <input
                  id="rsvp-phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="tel-national"
                  enterKeyHint="next"
                  placeholder=" "
                  value={form.phone}
                  onChange={(e) => update("phone", toMobile(e.target.value))}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby="rsvp-phone-error"
                />
                <label htmlFor="rsvp-phone">{t(S.phone)}</label>
                <span className="field__prefix" aria-hidden="true">
                  +91
                </span>
                <span id="rsvp-phone-error" className="field__error">
                  {errors.phone}
                </span>
              </div>

              <fieldset className="choice" aria-describedby="rsvp-attending-error" aria-invalid={Boolean(errors.attending)}>
                <legend>{t(S.attending)}</legend>
                {(["yes", "no"] as const).map((value) => (
                  <label key={value} className="choice__opt">
                    <input
                      type="radio"
                      name="attending"
                      value={value}
                      checked={form.attending === value}
                      onChange={() => update("attending", value)}
                    />
                    <span className="choice__card">
                      <span className="choice__mark" aria-hidden="true" />
                      <span className="choice__text">
                        <Rich text={t(value === "yes" ? S.yes : S.no)} />
                      </span>
                    </span>
                  </label>
                ))}
                <span id="rsvp-attending-error" className="field__error">
                  {errors.attending}
                </span>
              </fieldset>

              {form.attending === "yes" && (
                <div className="rsvp__more">
                  <div className="stepper">
                    <span className="stepper__label" id="rsvp-guests">
                      {t(S.guests)}
                    </span>
                    <div className="stepper__ctrl" role="group" aria-labelledby="rsvp-guests">
                      <button type="button" aria-label={t(S.fewer)} onClick={() => update("guests", Math.max(1, form.guests - 1))}>
                        −
                      </button>
                      <output aria-live="polite">{form.guests}</output>
                      <button type="button" aria-label={t(S.more)} onClick={() => update("guests", Math.min(12, form.guests + 1))}>
                        +
                      </button>
                    </div>
                  </div>
                  <fieldset className="checks">
                    <legend>{t(S.which)}</legend>
                    {EVENTS.map((ev) => (
                      <label key={ev.id}>
                        <input type="checkbox" checked={form.events.includes(ev.id)} onChange={() => toggleEvent(ev.id)} />
                        <span>
                          {plain(t(ev.title))} <small>· {ev.day}/11</small>
                        </span>
                      </label>
                    ))}
                  </fieldset>
                </div>
              )}

              <div className="field">
                <textarea id="rsvp-message" name="message" rows={3} placeholder=" " value={form.message} onChange={(e) => update("message", e.target.value)} />
                <label htmlFor="rsvp-message">
                  {t(S.message)} <span className="field__opt">{t(S.optional)}</span>
                </label>
              </div>

              <button ref={submit} type="submit" className="btn btn--gold btn--submit" data-magnetic>
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .3-3.4-.7-2.9-1.2-4.7-4.1-4.9-4.3-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.4 1.8 2.2 1.2 1.1 2.2 1.4 2.5 1.6.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l2 .9c.3.2.5.2.5.4.1.1.1.7-.1 1.3Z"
                  />
                </svg>
                <span>{t(S.submit)}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
