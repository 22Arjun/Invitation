"use client";

import { useRef } from "react";
import { CONTACTS, COUPLE, FAMILY, PHOTO_CREDITS, UI } from "@/content/wedding";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { useLang } from "@/lib/lang";
import { Badge } from "@/components/ornaments/Badge";
import { Mandala } from "@/components/ornaments/Mandala";
import { Split } from "@/components/ornaments/Split";

export function Footer() {
  const { lang, t } = useLang();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".footer__giant .split-i, .footer__giant em", {
          yPercent: 115,
          stagger: { each: 0.035, from: "center" },
          duration: 1.6,
          ease: "expo.out",
          scrollTrigger: { trigger: ".footer__giant", start: "top 95%", once: true },
        });
        gsap.to(".footer__mandala", {
          rotate: 90,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  );

  const groom = t(COUPLE.groom.name);
  const bride = t(COUPLE.bride.name);

  return (
    <footer ref={root} className="footer" data-theme="night">
      <div className="footer__top">
        <Mandala className="footer__mandala" core={false} />
        <p className="footer__invocation" lang="hi">
          {UI.invocation}
        </p>
        <p className="footer__line" data-reveal="fade">
          {t(UI.footer.line)}
        </p>
        <div className="footer__contacts" data-reveal="fade">
          <p className="eyebrow eyebrow--center">{t(UI.footer.contact)}</p>
          <ul>
            {CONTACTS.map((n) => (
              <li key={n}>
                <a href={`tel:+91${n.replace(/\D/g, "")}`} data-cursor={lang === "hi" ? "कॉल" : "Call"}>
                  {n}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="footer__giant" aria-label={`${groom} & ${bride}`}>
        <span aria-hidden="true">
          <Split text={groom} by="chars" />
        </span>
        <span className="footer__amp" aria-hidden="true">
          <em>&amp;</em>
        </span>
        <span aria-hidden="true">
          <Split text={bride} by="chars" />
        </span>
      </p>

      <div className="footer__bottom">
        <p>{t(FAMILY.senders.address)}</p>
        <p>{t(UI.footer.made)}</p>
        <p className="footer__credits">
          {t(UI.footer.credits)}:{" "}
          {PHOTO_CREDITS.map((c, i) => (
            <span key={c.url}>
              {i > 0 && " · "}“{c.title}” by{" "}
              <a href={c.url} target="_blank" rel="noopener noreferrer">
                {c.creator}
              </a>
            </span>
          ))}{" "}
          (
          <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">
            CC BY-SA 4.0
          </a>
          , cropped). Others via Unsplash &amp; WordPress Photo Directory.
        </p>
        <a href="#top" className="footer__toplink" aria-label={lang === "hi" ? "ऊपर चलें" : "Back to top"} data-magnetic>
          <Badge text={t(UI.footer.top)}>↑</Badge>
        </a>
      </div>
    </footer>
  );
}
