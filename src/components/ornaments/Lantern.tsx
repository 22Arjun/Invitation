import { useId, type CSSProperties } from "react";

type Props = {
  /** Chain length in px */
  drop: number;
  size?: number;
  className?: string;
  style?: CSSProperties;
};

/** A hanging brass kandil that sways on its chain; the glass glow flickers. */
export function Lantern({ drop, size = 54, className = "", style }: Props) {
  const id = useId().replace(/:/g, "");
  return (
    <div className={`lantern ${className}`} style={{ ...style, "--drop": `${drop}px`, "--size": `${size}px` } as CSSProperties} aria-hidden="true">
      <div className="lantern__sway">
      <span className="lantern__chain" />
      <svg className="lantern__body" viewBox="0 0 60 124">
        <defs>
          <linearGradient id={`g${id}`} x1="0" x2="1">
            <stop offset="0" stopColor="#8a5a1c" />
            <stop offset=".35" stopColor="#f3d48b" />
            <stop offset=".6" stopColor="#c8963e" />
            <stop offset="1" stopColor="#7a4b14" />
          </linearGradient>
          <radialGradient id={`l${id}`} cx=".5" cy=".55" r=".6">
            <stop offset="0" stopColor="#fff6d8" />
            <stop offset=".45" stopColor="#ffc861" stopOpacity=".95" />
            <stop offset="1" stopColor="#e07b12" stopOpacity=".55" />
          </radialGradient>
        </defs>
        <circle className="lantern__halo" cx="30" cy="62" r="34" fill={`url(#l${id})`} opacity=".35" />
        <circle cx="30" cy="5" r="3.6" fill="none" stroke={`url(#g${id})`} strokeWidth="1.6" />
        <path d="M13 31 Q30 3 47 31Z" fill={`url(#g${id})`} />
        <rect x="11" y="30" width="38" height="5" rx="1.6" fill={`url(#g${id})`} />
        <path className="lantern__glass" d="M14 35 L46 35 L51 54 L46 88 L14 88 L9 54Z" fill={`url(#l${id})`} />
        <path d="M14 35 L46 35 L51 54 L46 88 L14 88 L9 54Z M22 35 L20 54 L22 88 M30 35 V88 M38 35 L40 54 L38 88 M9 54 H51" fill="none" stroke={`url(#g${id})`} strokeWidth="1.3" />
        <path d="M24 82 V64 Q30 52 36 64 V82" fill="none" stroke="#8a5a1c" strokeWidth=".9" opacity=".7" />
        <rect x="11" y="88" width="38" height="5" rx="1.6" fill={`url(#g${id})`} />
        <path d="M15 93 Q30 112 45 93Z" fill={`url(#g${id})`} />
        <circle cx="30" cy="110" r="2.6" fill={`url(#g${id})`} />
        <path d="M30 112 V118 M27 118 L30 124 L33 118Z" stroke={`url(#g${id})`} fill={`url(#g${id})`} strokeWidth="1" />
      </svg>
      </div>
    </div>
  );
}
