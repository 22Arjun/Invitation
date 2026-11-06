"use client";

import Image from "next/image";
import { useRef } from "react";
import { COUPLE, KEY_EVENTS, UI } from "@/content/wedding";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { onIntro } from "@/lib/intro";
import { useLang } from "@/lib/lang";
import { setTheme } from "@/components/chrome/ThemeController";
import { FloralCorner } from "@/components/ornaments/Florals";
import { Lantern } from "@/components/ornaments/Lantern";
import { Mandala } from "@/components/ornaments/Mandala";
import { Split } from "@/components/ornaments/Split";
import { Bokeh } from "./Bokeh";
import { createWallRenderer } from "./heroWall";

export function Hero() {
  const { lang, t } = useLang();
  const stage = useRef<HTMLDivElement>(null);
  const wallCanvas = useRef<HTMLCanvasElement>(null);

  // The fly-through and the wall's entrance. Independent of language, so the pin is never rebuilt.
  useGSAP(
    () => {
      const canvas = wallCanvas.current;
      if (!canvas) return;
      const wall = createWallRenderer(canvas);
      const redraw = () => {
        wall.resize();
        wall.render();
      };
      redraw();
      window.addEventListener("resize", redraw);

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        wall.state.intro = 0;
        wall.render();

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage.current,
            start: "top top",
            end: "+=175%",
            pin: true,
            anticipatePin: 1,
            scrub: 1,
            invalidateOnRefresh: true,
            onRefreshInit: () => wall.resize(),
            onRefresh: () => wall.render(),
            onUpdate: (self) => setTheme(self.progress > 0.55 ? "night" : "cream"),
          },
        });
        tl.to(wall.state, { zoom: () => wall.maxZoom, ease: "power2.in", duration: 1, onUpdate: wall.render }, 0)
          .to(".hero__lanterns .lantern", { y: () => -window.innerHeight * 0.75, autoAlpha: 0, ease: "power2.in", duration: 0.5, stagger: 0.03 }, 0)
          .to(".hero__florals--l", { xPercent: -55, yPercent: 45, scale: 1.5, autoAlpha: 0, ease: "power2.in", duration: 0.5 }, 0)
          .to(".hero__florals--r", { xPercent: 55, yPercent: 45, scale: 1.5, autoAlpha: 0, ease: "power2.in", duration: 0.5 }, 0)
          .to(".hero__name--l", { xPercent: -45, autoAlpha: 0, ease: "power2.in", duration: 0.5 }, 0)
          .to(".hero__name--r", { xPercent: 45, autoAlpha: 0, ease: "power2.in", duration: 0.5 }, 0)
          .to(".hero__amp", { scale: 2.6, autoAlpha: 0, duration: 0.45 }, 0)
          .to(".hero__invocation, .hero__kicker, .hero__foot", { autoAlpha: 0, y: 40, duration: 0.3 }, 0)
          .fromTo(".hero__scene-media", { scale: 1.28 }, { scale: 1, duration: 1.1 }, 0)
          .set(canvas, { autoAlpha: 0 }, 1)
          .fromTo(".hero__scene-text > *", { autoAlpha: 0, y: 70 }, { autoAlpha: 1, y: 0, stagger: 0.07, duration: 0.35, ease: "power2.out" }, 0.72)
          .to({}, { duration: 0.35 });

        const intro = gsap
          .timeline({ paused: true })
          .to(wall.state, { intro: 1, duration: 1.9, onUpdate: wall.render }, 0.1)
          .from(".hero__lanterns .lantern", { yPercent: -160, duration: 2, stagger: 0.12, ease: "elastic.out(1, 0.55)" }, 0.2)
          .from(".hero__florals .leaf", { scale: 0, transformOrigin: "50% 100%", stagger: 0.03, duration: 1.2, ease: "expo.out" }, 0.3)
          .from(".hero__florals .bloom__inner", { scale: 0, rotate: -120, transformOrigin: "50% 50%", stagger: 0.07, duration: 1.6, ease: "back.out(1.5)" }, 0.35);
        return onIntro(() => intro.play());
      });

      return () => {
        window.removeEventListener("resize", redraw);
        mm.revert();
      };
    },
    { scope: stage },
  );

  // The names' entrance re-runs when the language changes, because the split text is re-rendered.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const intro = gsap
          .timeline({ paused: true })
          .from(".hero__name .split-i", { yPercent: 120, stagger: 0.04, duration: 1.7, ease: "expo.out" }, 0.4)
          .from(".hero__amp-inner", { scale: 0, rotate: -40, autoAlpha: 0, duration: 1.8, ease: "expo.out" }, 0.75)
          .from(".hero__invocation > span, .hero__kicker > span, .hero__family, .hero__foot > *", { autoAlpha: 0, y: 24, stagger: 0.08, duration: 1.3, ease: "expo.out" }, 0.9);
        return onIntro(() => intro.play());
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
            <Image src="/images/hero.jpg" alt="" fill preload sizes="100vw" className="hero__img" data-hero-img />
            <Mandala className="hero__scene-mandala" core={false} />
            <div className="hero__scene-tint" />
          </div>
          <Bokeh className="hero__bokeh" />
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
          <canvas ref={wallCanvas} className="hero__wall-canvas" aria-hidden="true" />
          <div className="hero__florals hero__florals--l">
            <FloralCorner />
          </div>
          <div className="hero__florals hero__florals--r">
            <FloralCorner className="florals--mirror" />
          </div>
          <div className="hero__lanterns">
            <Lantern drop={70} style={{ left: "9%" }} />
            <Lantern drop={190} size={64} style={{ left: "19%" }} />
            <Lantern drop={120} size={48} style={{ left: "29%" }} />
            <Lantern drop={120} size={48} style={{ right: "29%" }} />
            <Lantern drop={190} size={64} style={{ right: "19%" }} />
            <Lantern drop={70} style={{ right: "9%" }} />
          </div>
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
          <dl className="hero__dates">
            {KEY_EVENTS.map((e) => (
              <div key={e.id}>
                <dt>{t(e.short)}</dt>
                <dd>
                  {e.day} {t(e.month)}
                  <small>{t(e.weekday)}</small>
                </dd>
              </div>
            ))}
          </dl>
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
