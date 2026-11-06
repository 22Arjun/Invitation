"use client";

import { useRef, useState } from "react";
import { COUPLE, UI } from "@/content/wedding";
import { gsap, useGSAP } from "@/lib/gsap";
import { addressOf } from "@/lib/guest";
import { useGuest } from "@/lib/guest-context";
import { emitIntro } from "@/lib/intro";
import { useLang } from "@/lib/lang";
import { showerPetals } from "@/lib/petals";
import { lockScroll } from "@/lib/scroll";
import { archPath } from "@/lib/arch";
import { Mandala } from "@/components/ornaments/Mandala";

const PANEL = archPath({ cx: 250, width: 300, bottom: 880, spring: 360, apex: 130, lobes: 5 });
const PANEL_INNER = archPath({ cx: 250, width: 262, bottom: 860, spring: 372, apex: 168 });

/** One carved palace door; the right door is the same art mirrored. */
function DoorArt() {
  const studs: [number, number][] = [];
  for (let y = 420; y <= 820; y += 66) for (let x = 140; x <= 360; x += 55) studs.push([x, y]);
  return (
    <svg className="door__art" viewBox="0 0 500 1000" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="stud" cx=".35" cy=".35">
          <stop offset="0" stopColor="#fff1c9" />
          <stop offset=".5" stopColor="#d4a24c" />
          <stop offset="1" stopColor="#6b4413" />
        </radialGradient>
      </defs>
      <rect x="40" y="40" width="430" height="920" fill="none" stroke="#c8963e" strokeWidth="2" opacity=".6" />
      <rect x="56" y="56" width="398" height="888" fill="none" stroke="#c8963e" strokeWidth=".8" opacity=".5" />
      <path d={PANEL} fill="rgba(0,0,0,.18)" stroke="#d9ae5f" strokeWidth="2.4" />
      <path d={PANEL_INNER} fill="url(#doorJaali)" stroke="#c8963e" strokeWidth="1" opacity=".9" />
      {studs.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="6.5" fill="url(#stud)" />
      ))}
      <path d="M90 905 H410 M90 925 H410" stroke="#c8963e" strokeWidth="1.4" opacity=".7" />
      <rect x="470" y="0" width="30" height="1000" fill="#2b0512" opacity=".5" />
      <path d="M485 0 V1000" stroke="#d9ae5f" strokeWidth="3" strokeDasharray="2 10" />
      <circle cx="440" cy="800" r="24" fill="none" stroke="url(#stud)" strokeWidth="6" />
      <circle cx="440" cy="772" r="8" fill="url(#stud)" />
    </svg>
  );
}

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const { lang, t } = useLang();
  const guest = useGuest();

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      lockScroll(true);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const counter = el.querySelector(".preloader__count span");
      const progress = { v: 0 };
      const render = () => {
        if (counter) counter.textContent = String(Math.round(progress.v)).padStart(2, "0");
      };

      gsap
        .timeline()
        .fromTo(
          ".preloader__mandala path, .preloader__mandala circle, .preloader__mandala line",
          { strokeDasharray: 1, strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 2.2, ease: "power2.inOut", stagger: { amount: 1 } },
        )
        .from(".preloader__mandala", { rotate: -60, duration: 3.2, ease: "expo.out" }, 0)
        .from(".preloader__line", { autoAlpha: 0, y: 18, stagger: 0.14, duration: 1.1, ease: "expo.out" }, 0.35);
      const fill = gsap.to(progress, { v: 86, duration: 2.6, ease: "power1.out", onUpdate: render });

      const heroImg = document.querySelector<HTMLImageElement>("[data-hero-img]");
      let cancelled = false;
      Promise.all([
        document.fonts?.ready,
        heroImg?.decode().catch(() => undefined),
        new Promise((r) => setTimeout(r, reduce ? 200 : guest ? 3800 : 2700)),
      ]).then(() => {
        if (cancelled) return;
        fill.kill();
        gsap
          .timeline({ onComplete: () => setDone(true) })
          .to(progress, { v: 100, duration: 0.45, ease: "power2.out", onUpdate: render })
          .to(".preloader__center", { autoAlpha: 0, scale: 0.94, duration: 0.7, ease: "power3.in" }, "+=0.2")
          .addLabel("open")
          .add(() => {
            lockScroll(false);
            emitIntro();
            showerPetals(window.innerWidth < 700 ? 40 : 80);
          }, "open")
          .to(".preloader__glow", { opacity: 1, duration: 0.6 }, "open")
          .to(".door--l", { rotateY: 104, duration: reduce ? 0.01 : 2.1, ease: "power3.inOut" }, "open")
          .to(".door--r", { rotateY: -104, duration: reduce ? 0.01 : 2.1, ease: "power3.inOut" }, "open")
          .to(".preloader__doors", { scale: 1.12, duration: 2.1, ease: "power2.in" }, "open")
          .to(el, { autoAlpha: 0, duration: 0.7 }, "open+=1.5");
      });

      return () => {
        cancelled = true;
      };
    },
    { scope: root },
  );

  if (done) return null;

  return (
    <div ref={root} className="preloader" aria-hidden="true">
      <svg width="0" height="0" className="absolute">
        <defs>
          <pattern id="doorJaali" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M14 0 L28 14 L14 28 L0 14Z M14 7 L21 14 L14 21 L7 14Z" fill="none" stroke="#c8963e" strokeWidth=".7" opacity=".55" />
          </pattern>
        </defs>
      </svg>
      <div className="preloader__glow" />
      <div className="preloader__doors">
        <div className="door door--l">
          <DoorArt />
        </div>
        <div className="door door--r">
          <DoorArt />
        </div>
      </div>
      <div className="preloader__center">
        <Mandala className="preloader__mandala" />
        <p className="preloader__line preloader__invocation" lang="hi">
          {UI.invocation}
        </p>
        {guest && (
          <div className="preloader__line preloader__guest">
            <p className="preloader__guest-name">{addressOf(guest, lang)}</p>
            <p className="preloader__guest-welcome">{t(UI.guest.welcome)}</p>
          </div>
        )}
        <p className={`preloader__line preloader__names${guest ? " preloader__names--small" : ""}`}>
          {t(COUPLE.groom.name)} <em>&amp;</em> {t(COUPLE.bride.name)}
        </p>
        <p className="preloader__line preloader__count">
          <span>00</span>
        </p>
      </div>
    </div>
  );
}
