"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const INTERACTIVE = "[data-cursor], a, button, label, summary";

/** A two-part cursor (dot + lagging ring with contextual label) and magnetic hover for [data-magnetic]. */
export function Cursor() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = root.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.documentElement.classList.add("has-cursor");

    const dot = el.querySelector(".cursor__dot");
    const ring = el.querySelector(".cursor__ring");
    const label = el.querySelector<HTMLElement>(".cursor__label");
    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });

    let magnet: HTMLElement | null = null;
    const release = (m: HTMLElement) => gsap.to(m, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });

    const move = (e: PointerEvent) => {
      el.classList.add("is-visible");
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);

      const m = (e.target as Element).closest<HTMLElement>("[data-magnetic]");
      if (m !== magnet) {
        if (magnet) release(magnet);
        magnet = m;
      }
      if (m) {
        const r = m.getBoundingClientRect();
        gsap.to(m, {
          x: (e.clientX - (r.left + r.width / 2)) * 0.3,
          y: (e.clientY - (r.top + r.height / 2)) * 0.4,
          duration: 0.5,
          ease: "power3",
        });
      }
    };

    const over = (e: PointerEvent) => {
      const target = (e.target as Element).closest(INTERACTIVE);
      const text = target?.getAttribute("data-cursor") ?? "";
      el.classList.toggle("is-hover", Boolean(target));
      el.classList.toggle("has-label", Boolean(text));
      if (label) label.textContent = text;
    };

    const down = () => el.classList.add("is-down");
    const up = () => el.classList.remove("is-down");
    const leave = () => el.classList.remove("is-visible");

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("pointerleave", leave);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("has-cursor");
    };
  });

  return (
    <div ref={root} className="cursor" aria-hidden="true">
      <div className="cursor__ring">
        <span className="cursor__label" />
      </div>
      <div className="cursor__dot" />
    </div>
  );
}
