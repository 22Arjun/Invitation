import { useId, type CSSProperties } from "react";

/** A clay diya with a living flame. `delay` desynchronises flicker between lamps. */
export function Diya({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={`diya ${className}`} viewBox="0 0 100 92" style={{ "--d": `${delay}s` } as CSSProperties} aria-hidden="true">
      <defs>
        <radialGradient id={`glow${id}`}>
          <stop offset="0" stopColor="#ffd27a" stopOpacity=".75" />
          <stop offset="1" stopColor="#ff9f1c" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`flame${id}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ff5e00" />
          <stop offset=".45" stopColor="#ffb21e" />
          <stop offset="1" stopColor="#fff3c4" />
        </linearGradient>
        <linearGradient id={`clay${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d4743a" />
          <stop offset="1" stopColor="#7a2c12" />
        </linearGradient>
      </defs>
      <circle className="diya__glow" cx="50" cy="30" r="32" fill={`url(#glow${id})`} />
      <g className="diya__flame">
        <path d="M50 6 C59 19 61 31 50 42 C39 31 41 19 50 6Z" fill={`url(#flame${id})`} />
        <path d="M50 20 C54 27 55 33 50 39 C45 33 46 27 50 20Z" fill="#fff8de" opacity=".9" />
      </g>
      <path d="M50 42 V47" stroke="#3a1a0c" strokeWidth="1.4" />
      <path d="M8 47 Q50 43 92 47 Q88 74 50 78 Q12 74 8 47Z" fill={`url(#clay${id})`} />
      <ellipse cx="50" cy="47" rx="41" ry="5" fill="#e59a5c" />
      <ellipse cx="50" cy="47.5" rx="34" ry="3.2" fill="#5a1e0b" />
      {[22, 33, 44, 56, 67, 78].map((x) => (
        <circle key={x} cx={x} cy={60 + Math.abs(50 - x) * 0.08} r="1.7" fill="#f1c76b" />
      ))}
      <path d="M16 54 Q50 60 84 54" fill="none" stroke="#f1c76b" strokeWidth=".9" opacity=".8" />
      <ellipse cx="50" cy="80" rx="15" ry="4" fill="#6b250f" />
    </svg>
  );
}
