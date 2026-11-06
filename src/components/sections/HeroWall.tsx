import { archOutlinePoints, archPath, type ArchSpec } from "@/lib/arch";

export const OPENING: ArchSpec = { cx: 800, width: 400, bottom: 1000, spring: 470, apex: 205, lobes: 6 };
const FRAME: ArchSpec = { cx: 800, width: 452, bottom: 1000, spring: 470, apex: 160 };
const FRAME_OUTER: ArchSpec = { cx: 800, width: 480, bottom: 1000, spring: 470, apex: 136 };

/** viewBoxes are [x, y, width, height]; the mobile one is taller so the window sits lower with room for names above. */
export const VIEWBOX = {
  desktop: [0, 0, 1600, 1000],
  mobile: [460, -260, 680, 1360],
} as const;

const OPENING_D = archPath(OPENING);
const FRAME_D = archPath(FRAME);
const FRAME_OUTER_D = archPath(FRAME_OUTER);

const garland = archOutlinePoints(FRAME, 15);

/** A drooping toran strung across the window at the springline. */
const swag = Array.from({ length: 27 }, (_, i) => {
  const t = i / 26;
  const x = 600 + 400 * t;
  return [x, 470 + Math.sin(Math.PI * t) * 64] as const;
});

const strands = [-1, 1].map((side) => ({
  side,
  points: Array.from({ length: 9 }, (_, i) => [800 + side * 248, 486 + i * 15] as const),
}));

function Marigold({ x, y, r = 9, rose = false, v }: { x: number; y: number; r?: number; rose?: boolean; v: string }) {
  return (
    <g className="flower" transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
      {rose ? (
        <>
          <circle r={r * 0.92} fill={`url(#roseFill-${v})`} />
          <path d={`M${-r * 0.35} 0 A${r * 0.35} ${r * 0.35} 0 1 1 ${r * 0.35} 0 A${r * 0.22} ${r * 0.22} 0 1 1 ${-r * 0.1} 0`} fill="none" stroke="#7d0e3e" strokeWidth="1.1" opacity=".7" />
        </>
      ) : (
        <>
          <circle r={r} fill={`url(#marigoldFill-${v})`} />
          <circle r={r * 0.82} fill="none" stroke="#c45f00" strokeWidth={r * 0.32} strokeDasharray="1.5 1.3" opacity=".45" />
          <circle r={r * 0.28} fill="#b5530a" opacity=".55" />
        </>
      )}
    </g>
  );
}

export function HeroWall({ variant }: { variant: keyof typeof VIEWBOX }) {
  const [vx, vy, vw, vh] = VIEWBOX[variant];
  const id = variant;
  return (
    <svg
      className={`hero__wall-svg hero__wall-svg--${variant}`}
      viewBox={`${vx} ${vy} ${vw} ${vh}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <pattern id={`jaali-${id}`} width="56" height="56" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="#c8963e" strokeWidth=".7" opacity=".32">
            <circle cx="0" cy="0" r="28" />
            <circle cx="56" cy="0" r="28" />
            <circle cx="0" cy="56" r="28" />
            <circle cx="56" cy="56" r="28" />
            <circle cx="28" cy="28" r="28" />
            <circle cx="28" cy="28" r="4" />
          </g>
        </pattern>
        <radialGradient id={`wallLight-${id}`} cx=".5" cy=".55" r=".65">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset="1" stopColor="#f3e3c7" />
        </radialGradient>
        <mask id={`hole-${id}`} maskUnits="userSpaceOnUse" x={vx - 50} y={vy - 50} width={vw + 100} height={vh + 100}>
          <rect x={vx - 50} y={vy - 50} width={vw + 100} height={vh + 100} fill="#fff" />
          <path d={OPENING_D} fill="#000" />
        </mask>
        <clipPath id={`inside-${id}`}>
          <path d={OPENING_D} />
        </clipPath>
        <radialGradient id={`marigoldFill-${id}`} cx=".4" cy=".35">
          <stop offset="0" stopColor="#ffd25a" />
          <stop offset=".55" stopColor="#f59b0c" />
          <stop offset="1" stopColor="#d26a00" />
        </radialGradient>
        <radialGradient id={`roseFill-${id}`} cx=".4" cy=".35">
          <stop offset="0" stopColor="#f8a5c2" />
          <stop offset=".6" stopColor="#d6336c" />
          <stop offset="1" stopColor="#8f0f47" />
        </radialGradient>
        <linearGradient id={`gold-${id}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#9a6b22" />
          <stop offset=".45" stopColor="#efd38e" />
          <stop offset="1" stopColor="#a8752a" />
        </linearGradient>
      </defs>

      <g mask={`url(#hole-${id})`}>
        <rect x={vx - 50} y={vy - 50} width={vw + 100} height={vh + 100} fill={`url(#wallLight-${id})`} />
        <rect x={vx - 50} y={vy - 50} width={vw + 100} height={vh + 100} fill={`url(#jaali-${id})`} />
        <path d={FRAME_OUTER_D} fill="#f7ead2" stroke={`url(#gold-${id})`} strokeWidth="2.5" />
        <path d={FRAME_D} fill="#fbf2e2" stroke={`url(#gold-${id})`} strokeWidth="1.2" />
      </g>

      {/* the reveal: a soft inner shadow gives the window depth */}
      <path d={OPENING_D} fill="none" stroke="#4a0a26" strokeWidth="26" opacity=".28" clipPath={`url(#inside-${id})`} />
      <path d={OPENING_D} fill="none" stroke={`url(#gold-${id})`} strokeWidth="2.2" />

      <g className="hero__finial" fill={`url(#gold-${id})`}>
        <path d="M780 140 Q800 104 820 140Z" />
        <circle cx="800" cy="98" r="6" />
        <path d="M798 92 L800 66 L802 92Z" />
        <path d="M770 142 H830" stroke={`url(#gold-${id})`} strokeWidth="3" />
      </g>

      <g className="garland">
        {garland.map(([x, y], i) => (
          <Marigold key={`g${i}`} x={x} y={y} rose={i % 7 === 3} v={id} />
        ))}
      </g>
      <g className="garland">
        {strands.map(({ side, points }) =>
          points.map(([x, y], i) => <Marigold key={`s${side}${i}`} x={x} y={y} r={8} rose={i % 4 === 2} v={id} />),
        )}
        {strands.map(({ side }) => (
          <path key={`t${side}`} className="flower" d={`M${800 + side * 248 - 5} 620 L${800 + side * 248} 642 L${800 + side * 248 + 5} 620Z`} fill={`url(#gold-${id})`} />
        ))}
      </g>
      <g className="garland">
        {swag.map(([x, y], i) => (
          <Marigold key={`w${i}`} x={x} y={y} r={8.5} rose={i % 5 === 2} v={id} />
        ))}
      </g>
    </svg>
  );
}
