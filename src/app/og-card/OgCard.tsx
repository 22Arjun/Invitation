"use client";

import { COUPLE, KEY_EVENTS, UI } from "@/content/wedding";
import { archOutlinePoints, archPath, type ArchSpec } from "@/lib/arch";
import { FloralCorner } from "@/components/ornaments/Florals";
import { Lantern } from "@/components/ornaments/Lantern";
import "./og-card.css";

const W = 1200;
const H = 630;
const OPENING: ArchSpec = { cx: 600, width: 300, bottom: H + 20, spring: 250, apex: 62, lobes: 6 };
const FRAME: ArchSpec = { cx: 600, width: 340, bottom: H + 20, spring: 250, apex: 22 };
const OUTER: ArchSpec = { cx: 600, width: 362, bottom: H + 20, spring: 250, apex: 4 };

const garland = archOutlinePoints(FRAME, 13);
const swag = Array.from({ length: 23 }, (_, i) => {
  const t = i / 22;
  return [450 + 300 * t, 250 + Math.sin(Math.PI * t) * 52] as const;
});

function Flower({ x, y, r, rose }: { x: number; y: number; r: number; rose: boolean }) {
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
      <circle r={r} fill={rose ? "url(#og-rose)" : "url(#og-marigold)"} />
      {!rose && <circle r={r * 0.8} fill="none" stroke="#c45f00" strokeWidth={r * 0.3} strokeDasharray="1.4 1.2" opacity=".45" />}
      <circle r={r * 0.28} fill={rose ? "#7d0e3e" : "#b5530a"} opacity=".55" />
    </g>
  );
}

/** The 1200×630 share card: the hero's jharokha window, names either side, both key dates. */
export function OgCard() {
  const en = (t: { en: string }) => t.en;
  return (
    <div className="og-card" id="og-card">
      <div className="og-wall bg-jaali" />

      <svg className="og-arch" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        <defs>
          <clipPath id="og-opening">
            <path d={archPath(OPENING)} />
          </clipPath>
          <linearGradient id="og-gold" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#9a6b22" />
            <stop offset=".45" stopColor="#efd38e" />
            <stop offset="1" stopColor="#a8752a" />
          </linearGradient>
          <linearGradient id="og-tint" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#22060f" stopOpacity=".35" />
            <stop offset=".55" stopColor="#22060f" stopOpacity=".62" />
            <stop offset="1" stopColor="#22060f" stopOpacity=".85" />
          </linearGradient>
          <radialGradient id="og-marigold" cx=".4" cy=".35">
            <stop offset="0" stopColor="#ffd25a" />
            <stop offset=".55" stopColor="#f59b0c" />
            <stop offset="1" stopColor="#d26a00" />
          </radialGradient>
          <radialGradient id="og-rose" cx=".4" cy=".35">
            <stop offset="0" stopColor="#f8a5c2" />
            <stop offset=".6" stopColor="#d6336c" />
            <stop offset="1" stopColor="#8f0f47" />
          </radialGradient>
        </defs>
        <path d={archPath(OUTER)} fill="#f7ead2" stroke="url(#og-gold)" strokeWidth="2.5" />
        <path d={archPath(FRAME)} fill="#fbf2e2" stroke="url(#og-gold)" strokeWidth="1.2" />
        <g clipPath="url(#og-opening)">
          <image href="/images/hero.jpg" x="380" y="40" width="440" height="610" preserveAspectRatio="xMidYMid slice" />
          <rect x="400" y="0" width="400" height={H} fill="url(#og-tint)" />
        </g>
        <path d={archPath(OPENING)} fill="none" stroke="url(#og-gold)" strokeWidth="2.2" />
        {garland.map(([x, y], i) => (
          <Flower key={`g${i}`} x={x} y={y} r={7.5} rose={i % 7 === 3} />
        ))}
        {swag.map(([x, y], i) => (
          <Flower key={`s${i}`} x={x} y={y} r={7} rose={i % 5 === 2} />
        ))}
      </svg>

      <Lantern drop={34} size={46} style={{ left: "5%" }} className="og-lantern" />
      <Lantern drop={8} size={38} style={{ left: "17%" }} className="og-lantern" />
      <Lantern drop={8} size={38} style={{ right: "17%" }} className="og-lantern" />
      <Lantern drop={34} size={46} style={{ right: "5%" }} className="og-lantern" />

      <div className="og-florals og-florals-l">
        <FloralCorner />
      </div>
      <div className="og-florals og-florals-r">
        <FloralCorner className="florals--mirror" />
      </div>

      <div className="og-window">
        <p className="og-invocation" lang="hi">
          {UI.invocation}
        </p>
        <p className="og-amp">&amp;</p>
        <p className="og-shubh text-foil" lang="hi">
          शुभ विवाह
        </p>
        <p className="og-place">Bhind · Madhya Pradesh</p>
      </div>

      {(["groom", "bride"] as const).map((who, i) => {
        const event = KEY_EVENTS[i];
        return (
          <div key={who} className={`og-side ${i === 0 ? "og-left" : "og-right"}`}>
            <p className="og-name">{en(COUPLE[who].name)}</p>
            <p className="og-family">{en(COUPLE[who].family)}</p>
            <div className="og-date">
              <span className="og-date-label">{en(event.short)}</span>
              <span className="og-date-value">
                {event.day} {en(event.month)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
