import type { SVGProps } from "react";

const r2 = (n: number) => Math.round(n * 100) / 100;

function petal(r0: number, r1: number, w: number) {
  const len = r1 - r0;
  return `M0 ${-r0} C${w} ${r2(-(r0 + len * 0.35))} ${r2(w * 0.55)} ${r2(-(r1 - len * 0.15))} 0 ${-r1} C${r2(-w * 0.55)} ${r2(-(r1 - len * 0.15))} ${-w} ${r2(-(r0 + len * 0.35))} 0 ${-r0}Z`;
}

function ring(count: number, r0: number, r1: number, w: number, offset = 0) {
  return Array.from({ length: count }, (_, i) => (
    <path key={i} d={petal(r0, r1, w)} transform={`rotate(${r2((360 / count) * i + offset)})`} pathLength={1} />
  ));
}

function scallops(count: number, r: number) {
  const pts = Array.from({ length: count + 1 }, (_, i) => {
    const a = (Math.PI * 2 * i) / count;
    return [r2(Math.cos(a) * r), r2(Math.sin(a) * r)];
  });
  const bulge = r2(((2 * Math.PI * r) / count) * 0.62);
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) d += ` A${bulge} ${bulge} 0 0 1 ${pts[i][0]} ${pts[i][1]}`;
  return d;
}

/** A generative lotus mandala, drawn in line art with `currentColor`. */
export function Mandala({ core = true, ...props }: SVGProps<SVGSVGElement> & { core?: boolean }) {
  return (
    <svg viewBox="-100 -100 200 200" fill="none" stroke="currentColor" strokeWidth={0.45} aria-hidden="true" {...props}>
      <g className="mandala__core">
        {core && <circle r={4.5} fill="currentColor" stroke="none" />}
        {ring(8, 6.5, 19, 5)}
        <circle r={22} pathLength={1} />
      </g>
      <g className="mandala__mid">
        {ring(16, 23, 38, 4.6)}
        {Array.from({ length: 32 }, (_, i) => {
          const a = (Math.PI * 2 * i) / 32;
          return <circle key={i} cx={r2(Math.cos(a) * 41.5)} cy={r2(Math.sin(a) * 41.5)} r={0.9} fill="currentColor" stroke="none" />;
        })}
        <circle r={45} pathLength={1} />
      </g>
      <g className="mandala__lotus">
        {ring(12, 46, 71, 13)}
        {ring(12, 50, 64, 5.5)}
        {ring(12, 47, 62, 8, 15)}
        <path d={scallops(36, 76)} pathLength={1} />
        <circle r={81} pathLength={1} />
      </g>
      <g className="mandala__rim">
        {Array.from({ length: 72 }, (_, i) => {
          const a = (Math.PI * 2 * i) / 72;
          return (
            <line key={i} x1={r2(Math.cos(a) * 83)} y1={r2(Math.sin(a) * 83)} x2={r2(Math.cos(a) * 87)} y2={r2(Math.sin(a) * 87)} pathLength={1} />
          );
        })}
        {ring(24, 88, 98, 4.2, 7.5)}
      </g>
    </svg>
  );
}
