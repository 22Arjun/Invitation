"use client";

import Image from "next/image";
import { Fragment, useRef } from "react";
import { SHLOKA, UI } from "@/content/wedding";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { addressOf } from "@/lib/guest";
import { useGuest } from "@/lib/guest-context";
import { useLang } from "@/lib/lang";
import { Divider } from "@/components/ornaments/Divider";
import { Kalash } from "@/components/ornaments/Kalash";

const PILLS = ["/images/pill-1.jpg", "/images/pill-2.jpg", "/images/pill-3.jpg"];

export function Invitation() {
  const { lang, t } = useLang();
  const guest = useGuest();
  const root = useRef<HTMLElement>(null);

  // Words brighten one by one as you read down; tiny photo pills unfurl inside the sentence.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ".invitation__text", start: "top 78%", end: "bottom 42%", scrub: 0.6 },
        });
        tl.fromTo(".invitation__word", { opacity: 0.14 }, { opacity: 1, stagger: 0.1, ease: "none" }, 0).fromTo(
          ".pill",
          { width: 0, marginInline: 0, autoAlpha: 0 },
          { width: "1.9em", marginInline: "0.12em", autoAlpha: 1, stagger: 1.4, duration: 1.6, ease: "power2.out" },
          0.3,
        );
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  );

  const parts = t(UI.invitation.body).split(/\{(\d)\}/);

  return (
    <section ref={root} id="invitation" className="invitation" data-theme="cream">
      <div className="invitation__blessing">
        <Kalash className="invitation__kalash" data-reveal="draw" />
        <div className="invitation__shloka" lang="hi" data-reveal="stagger">
          {SHLOKA.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        {lang === "en" && (
          <p className="invitation__translation" data-reveal="fade">
            {t(SHLOKA.translation)}
          </p>
        )}
      </div>

      <Divider className="invitation__divider" />

      <p className="eyebrow eyebrow--center" data-reveal="fade">
        {t(UI.invitation.eyebrow)}
      </p>
      {guest && (
        <p className="invitation__dear" data-reveal="fade">
          {addressOf(guest, lang)},
        </p>
      )}
      <p className="invitation__text">
        {parts.map((part, i) =>
          i % 2 === 1 ? (
            <span key={i} className="pill" aria-hidden="true">
              <Image src={PILLS[Number(part)]} alt="" width={160} height={96} sizes="5rem" />
            </span>
          ) : (
            <Fragment key={i}>
              {part
                .trim()
                .split(/\s+/)
                .map((word, j) => (
                  <Fragment key={j}>
                    <span className="invitation__word">{word}</span>{" "}
                  </Fragment>
                ))}
            </Fragment>
          ),
        )}
      </p>
      <p className="invitation__sign" data-reveal="fade">
        {t(UI.invitation.sign)}, <span>{lang === "hi" ? "समस्त राजावत परिवार" : "the Rajawat family"}</span>
      </p>
    </section>
  );
}
