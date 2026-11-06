"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { scrollToTarget, setLenis } from "@/lib/scroll";

/** Lenis smooth scrolling driven by GSAP's ticker, plus smooth in-page anchor links. */
export function SmoothScroll() {
  useEffect(() => {
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      const href = link?.getAttribute("href");
      if (!href || href === "#") return;
      e.preventDefault();
      scrollToTarget(href === "#top" ? 0 : href);
    };
    document.addEventListener("click", onClick);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => document.removeEventListener("click", onClick);
    }

    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true, autoRaf: false });
    setLenis(lenis);
    if (document.documentElement.classList.contains("is-locked")) lenis.stop();
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
