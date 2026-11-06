"use client";

import { Fragment, useRef } from "react";
import { UI } from "@/content/wedding";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useLang } from "@/lib/lang";
import { Rich } from "@/components/ornaments/Split";

/** An endless ribbon that speeds up, reverses and leans with scroll velocity. */
export function Marquee() {
  const { t } = useLang();
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = root.current?.querySelector(".marquee__track");
      if (!track || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      let x = 0;
      let dir = -1;
      let velocity = 0;
      const skew = gsap.quickTo(track, "skewX", { duration: 0.6, ease: "power3" });
      const st = ScrollTrigger.create({
        onUpdate: (self) => {
          velocity = self.getVelocity();
          dir = self.direction === 1 ? -1 : 1;
        },
      });
      const tick = () => {
        const boost = 1 + Math.min(Math.abs(velocity) / 350, 7);
        x += dir * 0.03 * boost;
        if (x <= -50) x += 50;
        if (x > 0) x -= 50;
        gsap.set(track, { xPercent: x, force3D: true });
        skew(gsap.utils.clamp(-9, 9, velocity / -280));
        velocity *= 0.92;
      };
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        st.kill();
      };
    },
    { scope: root },
  );

  const group = (
    <div className="marquee__group">
      {UI.marquee.map((item, i) => (
        <Fragment key={i}>
          <span className="marquee__item">
            <Rich text={t(item)} />
          </span>
          <svg className="marquee__sep" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0Z" fill="currentColor" />
          </svg>
        </Fragment>
      ))}
    </div>
  );

  return (
    <div ref={root} className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {group}
        {group}
      </div>
    </div>
  );
}
