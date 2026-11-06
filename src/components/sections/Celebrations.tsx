"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { EVENTS, UI } from "@/content/wedding";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useLang } from "@/lib/lang";
import { Mandala } from "@/components/ornaments/Mandala";
import { Rich, Split } from "@/components/ornaments/Split";
import { ArchOutline } from "./ArchOutline";

/** The four ceremonies as sticky cards that stack, each receding as the next slides over it. */
export function Celebrations() {
  const { t } = useLang();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const cards = gsap.utils.toArray<HTMLElement>(".stack__card");
      // A card may only stick (and be covered by the next) after its whole height has been on screen;
      // on phones the cards are taller than the viewport, so they stick higher, even partly above it.
      const stickAt = (card: HTMLElement, i: number) => {
        const bottomClearance = window.matchMedia("(width < 48rem)").matches ? 92 : 12; // the mobile dock
        return Math.min(window.innerHeight * 0.09 + i * 18, window.innerHeight - card.offsetHeight - bottomClearance);
      };
      const setSticky = () => cards.forEach((card, i) => card.style.setProperty("--stick", `${stickAt(card, i)}px`));
      setSticky();
      ScrollTrigger.addEventListener("refreshInit", setSticky);

      mm.add(MOTION_OK, () => {
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (next) {
            gsap
              .timeline({ scrollTrigger: { trigger: next, start: "top bottom", end: () => `top ${stickAt(next, i + 1)}px`, scrub: true, invalidateOnRefresh: true } })
              .to(card, { scale: 0.9 + i * 0.012, ease: "none" }, 0)
              .to(card.querySelector(".stack__shade"), { opacity: 0.55, ease: "none" }, 0);
          }
          gsap.fromTo(
            card.querySelector(".stack__media img"),
            { yPercent: -8, scale: 1.15 },
            { yPercent: 8, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true } },
          );
          gsap.to(card.querySelector(".stack__mandala"), {
            rotate: 120,
            ease: "none",
            scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
          });
        });
      });
      return () => {
        ScrollTrigger.removeEventListener("refreshInit", setSticky);
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} id="celebrations" className="celebrations" data-theme="cream">
      <header className="section-head">
        <p className="eyebrow" data-reveal="fade">
          {t(UI.celebrations.eyebrow)}
        </p>
        <h2 className="display" data-reveal="split">
          <Split text={t(UI.celebrations.title)} />
        </h2>
        <p className="lede" data-reveal="fade">
          {t(UI.celebrations.lede)}
        </p>
      </header>

      <div className="stack">
        {EVENTS.map((event, i) => (
          <article key={event.id} className={`stack__card tone-${event.tone}`} style={{ "--i": i } as CSSProperties}>
            <Mandala className="stack__mandala" core={false} />
            <div className="stack__inner">
              <div className="stack__text">
                <p className="stack__index">
                  0{i + 1}
                  <span> / 0{EVENTS.length}</span>
                </p>
                <p className="stack__subtitle">{t(event.subtitle)}</p>
                <h3 className="stack__title">
                  <Rich text={t(event.title)} />
                </h3>
                <div className="stack__date">
                  <span className="stack__weekday">{t(event.weekday)}</span>
                  <span className="stack__day">{event.day}</span>
                  <span className="stack__month">{t(event.month)}</span>
                </div>
                <p className="stack__meta">
                  {event.time && event.venue ? (
                    <>
                      <strong>{t(event.time)}</strong> · {t(event.venue)}
                    </>
                  ) : (
                    t(UI.celebrations.familyRitual)
                  )}
                </p>
                <p className="stack__desc">{t(event.description)}</p>
              </div>
              <figure className="stack__media">
                <div className="stack__frame">
                  <Image src={event.image} alt={t(event.imageAlt)} fill sizes="(max-width: 768px) 70vw, 34vw" />
                </div>
                <ArchOutline className="stack__outline" />
              </figure>
            </div>
            <div className="stack__shade" />
          </article>
        ))}
      </div>
    </section>
  );
}
