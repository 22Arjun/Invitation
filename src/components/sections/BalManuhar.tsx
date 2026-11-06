"use client";

import { useRef, type CSSProperties } from "react";
import { BAL_MANUHAR } from "@/content/wedding";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { useLang } from "@/lib/lang";

/** The children's couplet, bouncing in word by word under a slow fall of petals. */
export function BalManuhar() {
  const { lang, t } = useLang();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".manuhar__word", {
          yPercent: () => gsap.utils.random(-140, -80),
          rotate: () => gsap.utils.random(-25, 25),
          autoAlpha: 0,
          duration: 1.4,
          ease: "elastic.out(1, 0.55)",
          stagger: 0.06,
          scrollTrigger: { trigger: ".manuhar__poem", start: "top 80%", once: true },
        });
        gsap.from(".manuhar__kids span", {
          scale: 0,
          rotate: -20,
          duration: 1,
          ease: "back.out(3)",
          stagger: 0.12,
          scrollTrigger: { trigger: ".manuhar__kids", start: "top 90%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  );

  return (
    <section ref={root} id="bal-manuhar" className="manuhar" data-theme="rani">
      <div className="manuhar__petals" aria-hidden="true">
        {Array.from({ length: 16 }, (_, i) => (
          <i key={i} style={{ "--x": `${(i * 61) % 100}%`, "--d": `${(i * 0.83) % 9}s`, "--s": `${0.6 + ((i * 7) % 5) / 6}` } as CSSProperties} />
        ))}
      </div>
      <p className="eyebrow eyebrow--center" data-reveal="fade">
        {lang === "en" ? t(BAL_MANUHAR.title) : "मेरे चाचा की शादी"}
      </p>
      <h2 className="manuhar__title" lang="hi" data-reveal="fade">
        बाल मनुहार
      </h2>
      <blockquote className="manuhar__poem" lang="hi">
        {BAL_MANUHAR.lines.map((halves) => (
          <p key={halves[0]}>
            {halves.map((half) => (
              <span key={half} className="manuhar__half">
                {half.split(" ").map((word, i) => (
                  <span key={i} className="manuhar__word">
                    {word}
                  </span>
                ))}
              </span>
            ))}
          </p>
        ))}
      </blockquote>
      {lang === "en" && (
        <p className="manuhar__translation" data-reveal="fade">
          {BAL_MANUHAR.translation.join(" ")}
        </p>
      )}
      <p className="manuhar__kids">
        {t(BAL_MANUHAR.kids)
          .split(/,\s*|\s*&\s*/)
          .map((kid) => (
            <span key={kid}>{kid}</span>
          ))}
      </p>
    </section>
  );
}
