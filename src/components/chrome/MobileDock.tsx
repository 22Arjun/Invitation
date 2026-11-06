"use client";

import { useRef } from "react";
import { UI } from "@/content/wedding";
import { DIRECTIONS, downloadIcs } from "@/lib/calendar";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useLang } from "@/lib/lang";

/**
 * Phones only: a floating bar of the three things guests reach for — directions, the calendar and
 * the RSVP — in thumb reach. It appears after the hero and steps aside over the RSVP form and footer.
 */
export function MobileDock() {
  const { t } = useLang();
  const dock = useRef<HTMLElement>(null);

  useGSAP(() => {
    const el = dock.current;
    if (!el) return;
    const zones: Partial<Record<"afterHero" | "atRsvp" | "atFooter", ScrollTrigger>> = {};
    const update = () => {
      const { afterHero, atRsvp, atFooter } = zones;
      el.classList.toggle("is-visible", Boolean(afterHero?.isActive && !atRsvp?.isActive && !atFooter?.isActive));
    };
    zones.afterHero = ScrollTrigger.create({ trigger: "#invitation", start: "top 70%", end: "max", onToggle: update });
    zones.atRsvp = ScrollTrigger.create({ trigger: "#rsvp", start: "top 85%", end: "bottom 30%", onToggle: update });
    zones.atFooter = ScrollTrigger.create({ trigger: "footer", start: "top 92%", end: "max", onToggle: update });
    update();
  });

  return (
    <nav ref={dock} className="dock" aria-label={t(UI.dock.label)}>
      <a className="dock__item" href={DIRECTIONS} target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 21s-7-7.6-7-12a7 7 0 0 1 14 0c0 4.4-7 12-7 12Z" />
          <circle cx="12" cy="9" r="2.6" />
        </svg>
        <span>{t(UI.dock.directions)}</span>
      </a>
      <button className="dock__item" type="button" onClick={downloadIcs}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
          <path d="M3.5 10h17M8 3v4M16 3v4M9.5 15h5M12 12.5v5" />
        </svg>
        <span>{t(UI.dock.calendar)}</span>
      </button>
      <a className="dock__item dock__item--primary" href="#rsvp">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z" />
        </svg>
        <span>{t(UI.dock.rsvp)}</span>
      </a>
    </nav>
  );
}
