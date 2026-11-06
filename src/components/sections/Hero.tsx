"use client";

import Image from "next/image";
import { useRef } from "react";
import { COUPLE, UI } from "@/content/wedding";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { onIntro } from "@/lib/intro";
import { useLang } from "@/lib/lang";
import { setTheme } from "@/components/chrome/ThemeController";
import { FloralCorner } from "@/components/ornaments/Florals";
import { Lantern } from "@/components/ornaments/Lantern";
import { Mandala } from "@/components/ornaments/Mandala";
import { Split } from "@/components/ornaments/Split";
import { Bokeh } from "./Bokeh";
import { HeroWall, OPENING, VIEWBOX } from "./HeroWall";

const MOBILE = "(max-width: 767px)";

/**
 * Where the window's rectangular opening lands on screen, and how far the wall must scale
 * (about that opening's centre) for the opening to swallow the whole viewport.
 */
function flyThrough() {
  const [vx, vy, vw, vh] = window.matchMedia(MOBILE).matches ? VIEWBOX.mobile : VIEWBOX.desktop;
  const W = window.innerWidth;
  const H = window.innerHeight;
  const k = Math.max(W / vw, H / vh);
  const sx = (u: number) => W / 2 + (u - (vx + vw / 2)) * k;
  const sy = (u: number) => H / 2 + (u - (vy + vh / 2)) * k;
  const left = sx(OPENING.cx - OPENING.width / 2);
  const right = sx(OPENING.cx + OPENING.width / 2);
  const top = sy(OPENING.spring);
  const bottom = sy(OPENING.bottom);
  const ox = (left + right) / 2;
  const oy = (top + bottom) / 2;
  const scale = Math.max(ox / (ox - left), (W - ox) / (right - ox), oy / (oy - top), (H - oy) / Math.max(bottom - oy, 1)) * 1.08;
  return { origin: `${ox}px ${oy}px`, scale };
}

export function Hero() {
  const { lang, t } = useLang();
  const stage = useRef<HTMLDivElement>(null);

  // The fly-through: pinned, scrubbed, independent of language so the pin is never rebuilt.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        let fly = flyThrough();
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage.current,
            start: "top top",
            end: "+=175%",
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onRefreshInit: () => {
              fly = flyThrough();
            },
            onUpdate: (self) => setTheme(self.progress > 0.55 ? "night" : "cream"),
          },
        });
        tl.set(".hero__wall", { transformOrigin: () => fly.origin }, 0)
          .to(".hero__wall", { scale: () => fly.scale, ease: "power2.in", duration: 1 }, 0)
          .to(".hero__name--l", { xPercent: -45, autoAlpha: 0, ease: "power2.in", duration: 0.5 }, 0)
          .to(".hero__name--r", { xPercent: 45, autoAlpha: 0, ease: "power2.in", duration: 0.5 }, 0)
          .to(".hero__amp", { scale: 2.6, autoAlpha: 0, duration: 0.45 }, 0)
          .to(".hero__invocation, .hero__kicker, .hero__foot", { autoAlpha: 0, y: 40, duration: 0.3 }, 0)
          .fromTo(".hero__scene-media", { scale: 1.28 }, { scale: 1, duration: 1.1 }, 0)
          .to(".hero__scene-tint", { opacity: 1, duration: 0.6 }, 0.4)
          .set(".hero__wall", { autoAlpha: 0 }, 1)
          .fromTo(
            ".hero__scene-text > *",
            { autoAlpha: 0, y: 70 },
            { autoAlpha: 1, y: 0, stagger: 0.07, duration: 0.35, ease: "power2.out" },
            0.72,
          )
          .to({}, { duration: 0.35 });
      });
      return () => mm.revert();
    },
    { scope: stage },
  );

  // The entrance, played once the preloader doors have opened.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const intro = gsap
          .timeline({ paused: true })
          .from(".hero__scene-zoom", { scale: 1.45, duration: 3, ease: "expo.out" }, 0)
          .from(".garland .flower", { scale: 0, transformOrigin: "50% 50%", stagger: { each: 0.005, from: "end" }, duration: 0.7, ease: "back.out(3)" }, 0.15)
          .from(".hero__lanterns .lantern", { yPercent: -160, duration: 2, stagger: 0.12, ease: "elastic.out(1, 0.55)" }, 0.2)
          .from(".hero__florals .leaf", { scale: 0, transformOrigin: "50% 100%", stagger: 0.03, duration: 1.2, ease: "expo.out" }, 0.3)
          .from(".hero__florals .bloom__inner", { scale: 0, rotate: -120, transformOrigin: "50% 50%", stagger: 0.07, duration: 1.6, ease: "back.out(1.5)" }, 0.35)
          .from(".hero__name .split-i", { yPercent: 120, stagger: 0.04, duration: 1.7, ease: "expo.out" }, 0.4)
          .from(".hero__amp-inner", { scale: 0, rotate: -40, autoAlpha: 0, duration: 1.8, ease: "expo.out" }, 0.75)
          .from(".hero__invocation > span, .hero__kicker > span, .hero__family, .hero__foot > *", { autoAlpha: 0, y: 24, stagger: 0.08, duration: 1.3, ease: "expo.out" }, 0.9);
        const off = onIntro(() => intro.play());
        return off;
      });
      return () => mm.revert();
    },
    { scope: stage, dependencies: [lang], revertOnUpdate: true },
  );

  const groom = t(COUPLE.groom.name);
  const bride = t(COUPLE.bride.name);

  return (
    <section id="top" className="hero" data-theme="cream" aria-label={`${groom} & ${bride}`}>
      <div ref={stage} className="hero__stage">
        <div className="hero__scene">
          <div className="hero__scene-media">
            <div className="hero__scene-zoom">
              <Image src="/images/hero.jpg" alt="" fill preload sizes="100vw" className="hero__img" data-hero-img />
              <Bokeh className="hero__bokeh" />
              <Mandala className="hero__scene-mandala" core={false} />
            </div>
          </div>
          <div className="hero__scene-tint" />
          <div className="hero__scene-text">
            <p className="eyebrow">{t(UI.hero.sceneEyebrow)}</p>
            <p className="hero__shubh text-foil" lang="hi">
              शुभ विवाह
            </p>
            <p className="hero__scene-sub">{t(UI.hero.sceneSub)}</p>
            <p className="hero__scene-dates">{t(UI.hero.sceneDates)}</p>
          </div>
        </div>

        <div className="hero__wall">
          <HeroWall variant="desktop" />
          <HeroWall variant="mobile" />
          <div className="hero__lanterns">
            <Lantern drop={70} style={{ left: "9%" }} />
            <Lantern drop={190} size={64} style={{ left: "19%" }} />
            <Lantern drop={120} size={48} style={{ left: "29%" }} />
            <Lantern drop={120} size={48} style={{ right: "29%" }} />
            <Lantern drop={190} size={64} style={{ right: "19%" }} />
            <Lantern drop={70} style={{ right: "9%" }} />
          </div>
          <FloralCorner className="hero__florals hero__florals--l" />
          <FloralCorner className="hero__florals hero__florals--r" />
        </div>

        <p className="hero__invocation" lang="hi">
          <span>{UI.invocation}</span>
        </p>

        <h1 className="hero__title">
          <span className="sr-only">
            {groom} &amp; {bride}
          </span>
          <span className="hero__name hero__name--l" aria-hidden="true">
            <span className="hero__name-text">
              <Split text={groom} by="chars" />
            </span>
            <span className="hero__family">{t(COUPLE.groom.family)}</span>
          </span>
          <span className="hero__amp" aria-hidden="true">
            <span className="hero__amp-inner">&amp;</span>
          </span>
          <span className="hero__name hero__name--r" aria-hidden="true">
            <span className="hero__name-text">
              <Split text={bride} by="chars" />
            </span>
            <span className="hero__family">{t(COUPLE.bride.family)}</span>
          </span>
        </h1>

        <p className="hero__kicker">
          <span>{t(UI.hero.kicker)}</span>
        </p>

        <div className="hero__foot">
          <p className="hero__date">{t(UI.hero.date)}</p>
          <p className="hero__place">{t(UI.hero.place)}</p>
          <a href="#invitation" className="hero__cue" data-cursor={lang === "hi" ? "स्वागतम्" : "Enter"}>
            <span>{lang === "hi" ? "प्रवेश करें" : "Scroll to enter"}</span>
            <i aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
