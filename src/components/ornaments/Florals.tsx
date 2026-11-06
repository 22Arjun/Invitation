import { useId } from "react";

const r2 = (n: number) => Math.round(n * 100) / 100;

function petalPath(len: number, w: number) {
  return `M0 0 C${r2(w)} ${r2(-len * 0.25)} ${r2(w * 1.05)} ${r2(-len * 0.85)} 0 ${-len} C${r2(-w * 1.05)} ${r2(-len * 0.85)} ${r2(-w)} ${r2(-len * 0.25)} 0 0Z`;
}

type BloomProps = { x: number; y: number; r: number; rot?: number; grad: string };

/** A peony-like bloom built from three rings of petals. */
function Bloom({ x, y, r, rot = 0, grad }: BloomProps) {
  const rings = [
    { n: 10, len: r, w: r * 0.42, fill: `url(#${grad}a)`, off: 0 },
    { n: 8, len: r * 0.74, w: r * 0.36, fill: `url(#${grad}b)`, off: 14 },
    { n: 6, len: r * 0.48, w: r * 0.3, fill: `url(#${grad}c)`, off: 30 },
  ];
  return (
    <g className="bloom" transform={`translate(${x} ${y}) rotate(${rot})`}>
      <g className="bloom__inner">
        {rings.map((ring, ri) =>
          Array.from({ length: ring.n }, (_, i) => (
            <path key={`${ri}-${i}`} d={petalPath(ring.len, ring.w)} transform={`rotate(${r2((360 / ring.n) * i + ring.off)})`} fill={ring.fill} />
          )),
        )}
        <circle r={r * 0.15} fill="#6e0b36" />
        {Array.from({ length: 10 }, (_, i) => {
          const a = (Math.PI * 2 * i) / 10;
          return <circle key={i} cx={r2(Math.cos(a) * r * 0.2)} cy={r2(Math.sin(a) * r * 0.2)} r={r * 0.03} fill="#f3d48b" />;
        })}
      </g>
    </g>
  );
}

function Leaf({ x, y, len, rot, gold = false }: { x: number; y: number; len: number; rot: number; gold?: boolean }) {
  const w = len * 0.28;
  return (
    <g className="leaf" transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path
        d={`M0 0 C${r2(w)} ${r2(-len * 0.3)} ${r2(w * 0.7)} ${r2(-len * 0.8)} 0 ${-len} C${r2(-w * 0.7)} ${r2(-len * 0.8)} ${r2(-w)} ${r2(-len * 0.3)} 0 0Z`}
        fill={gold ? "rgba(233,201,130,.25)" : "#7d8a5a"}
        stroke={gold ? "#c8963e" : "none"}
        strokeWidth={gold ? 1.1 : 0}
        opacity={gold ? 1 : 0.85}
      />
      <path d={`M0 0 L0 ${r2(-len * 0.92)}`} stroke={gold ? "#c8963e" : "#5e6b3d"} strokeWidth=".8" />
    </g>
  );
}

/** A watercolour-inspired cluster of rani-pink blooms with gold foliage, anchored to the bottom-left. */
export function FloralCorner({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={`florals ${className}`} viewBox="0 0 420 420" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}a`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#b3135a" />
          <stop offset=".6" stopColor="#e0457b" />
          <stop offset="1" stopColor="#f8b8cc" />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#8f0f47" />
          <stop offset="1" stopColor="#e0457b" />
        </linearGradient>
        <linearGradient id={`${id}c`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#6e0b36" />
          <stop offset="1" stopColor="#c2185b" />
        </linearGradient>
      </defs>
      <Leaf x={70} y={350} len={150} rot={-28} gold />
      <Leaf x={120} y={360} len={120} rot={8} gold />
      <Leaf x={60} y={330} len={110} rot={-62} />
      <Leaf x={180} y={390} len={130} rot={48} gold />
      <Leaf x={40} y={260} len={100} rot={-12} gold />
      <Leaf x={150} y={340} len={90} rot={70} />
      <Leaf x={20} y={300} len={130} rot={-44} gold />
      <Bloom x={70} y={360} r={74} rot={8} grad={id} />
      <Bloom x={190} y={392} r={52} rot={-14} grad={id} />
      <Bloom x={34} y={232} r={46} rot={22} grad={id} />
      <Bloom x={140} y={290} r={28} rot={4} grad={id} />
      <Bloom x={258} y={404} r={24} rot={40} grad={id} />
      {[
        [210, 300],
        [100, 200],
        [250, 350],
        [60, 160],
      ].map(([cx, cy]) => (
        <circle key={`${cx}${cy}`} className="leaf" cx={cx} cy={cy} r={4} fill="#e9c982" />
      ))}
    </svg>
  );
}
