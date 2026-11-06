"use client";

import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useLang } from "@/lib/lang";

/**
 * Generic scroll reveals, created after every section so pinned sections above are already measured.
 * Re-runs when the language changes, because the split text is re-rendered.
 */
export function Reveals() {
  const { lang } = useLang();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>('[data-reveal="split"]').forEach((el) => {
          gsap.from(el.querySelectorAll(".split-i"), {
            yPercent: 118,
            rotate: 4,
            duration: 1.35,
            ease: "expo.out",
            stagger: 0.05,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>('[data-reveal="fade"]').forEach((el) => {
          gsap.from(el, {
            y: 36,
            autoAlpha: 0,
            duration: 1.3,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>('[data-reveal="stagger"]').forEach((el) => {
          gsap.from(el.children, {
            y: 40,
            autoAlpha: 0,
            duration: 1.2,
            ease: "expo.out",
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>('[data-reveal="divider"]').forEach((el) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 92%", once: true } });
          tl.from(el.querySelector(".divider__star"), { scale: 0, rotate: -180, duration: 1.1, ease: "back.out(2)" }).from(
            el.querySelectorAll(".divider__line"),
            { scaleX: 0, duration: 1.4, ease: "expo.out" },
            0.1,
          );
        });

        gsap.utils.toArray<HTMLElement>('[data-reveal="image"]').forEach((el) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 85%", once: true } });
          tl.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" }).from(
            el.querySelector("img"),
            { scale: 1.35, duration: 2, ease: "expo.out" },
            0.2,
          );
        });

        gsap.utils.toArray<SVGElement>('[data-reveal="draw"]').forEach((el) => {
          gsap.fromTo(
            el.querySelectorAll("path, circle, line"),
            { strokeDasharray: 1, strokeDashoffset: 1 },
            {
              strokeDashoffset: 0,
              duration: 2.4,
              ease: "power2.inOut",
              stagger: { amount: 1.2 },
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
          const speed = Number(el.dataset.speed);
          gsap.fromTo(
            el,
            { y: () => -speed * window.innerHeight * 0.15 },
            {
              y: () => speed * window.innerHeight * 0.15,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
            },
          );
        });
      });

      // Language swaps change text heights; re-measure once the new layout settles.
      const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
      return () => {
        window.clearTimeout(id);
        mm.revert();
      };
    },
    { dependencies: [lang], revertOnUpdate: true },
  );

  return null;
}
