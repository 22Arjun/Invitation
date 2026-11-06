"use client";

import Image from "next/image";
import { useRef } from "react";
import { GALLERY, UI } from "@/content/wedding";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { useLang } from "@/lib/lang";
import { Split } from "@/components/ornaments/Split";

/** A pinned horizontal gallery on large screens; a native swipe strip on touch screens. */
export function Shringaar() {
  const { t } = useLang();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (min-width: 900px)`, () => {
        const track = root.current?.querySelector<HTMLElement>(".shringaar__track");
        if (!track) return;
        const distance = () => track.scrollWidth - window.innerWidth;
        const scroll = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".shringaar__pin",
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            anticipatePin: 1,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(".shringaar__progress span", { scaleX: self.progress }),
          },
        });
        gsap.utils.toArray<HTMLElement>(".shot").forEach((shot, i) => {
          gsap.fromTo(
            shot.querySelector("img"),
            { xPercent: -10 },
            {
              xPercent: 10,
              ease: "none",
              scrollTrigger: { trigger: shot, containerAnimation: scroll, start: "left right", end: "right left", scrub: true },
            },
          );
          gsap.fromTo(
            shot,
            { y: i % 2 ? 60 : -40, rotate: i % 2 ? 2 : -2 },
            {
              y: i % 2 ? -40 : 60,
              rotate: i % 2 ? -2 : 2,
              ease: "none",
              scrollTrigger: { trigger: shot, containerAnimation: scroll, start: "left right", end: "right left", scrub: true },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="shringaar" className="shringaar" data-theme="night">
      <div className="shringaar__pin">
        <div className="shringaar__track">
          <div className="shringaar__intro">
            <p className="eyebrow">{t(UI.shringaar.eyebrow)}</p>
            <h2 className="display" data-reveal="split">
              <Split text={t(UI.shringaar.title)} />
            </h2>
            <p className="shringaar__hint" aria-hidden="true">
              <span />
              <span className="shringaar__hint-scroll">{t(UI.shringaar.hint)}</span>
              <span className="shringaar__hint-touch">{t(UI.shringaar.swipe)}</span>
            </p>
          </div>
          {GALLERY.map((item, i) => (
            <figure key={item.src} className={`shot shot--${item.shape}`} data-cursor={item.word.hi}>
              <div className="shot__frame">
                <Image src={item.src} alt={t(item.alt)} fill sizes="(max-width: 900px) 70vw, 30vw" style={{ objectPosition: item.position }} />
              </div>
              <figcaption>
                <span className="shot__num">{String(i + 1).padStart(2, "0")}</span>
                <span className="shot__word" lang="hi">
                  {item.word.hi}
                </span>
                <span className="shot__en">{item.word.en}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="shringaar__progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}
