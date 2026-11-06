type Pt = [number, number];

export type ArchSpec = {
  cx: number;
  width: number;
  /** y of the bottom of the opening */
  bottom: number;
  /** y where the straight jambs end and the arch begins */
  spring: number;
  /** y of the pointed apex */
  apex: number;
  /** cusps per side; 0 draws a smooth pointed arch */
  lobes?: number;
};

const cubic = (p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt => {
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
};

/** Control points for the left half of a Mughal-style pointed arch. */
function leftCurve({ cx, width, spring, apex }: ArchSpec): [Pt, Pt, Pt, Pt] {
  const x0 = cx - width / 2;
  const rise = spring - apex;
  return [
    [x0, spring],
    [x0, spring - rise * 0.62],
    [cx - width * 0.16, apex + rise * 0.2],
    [cx, apex],
  ];
}

/** Points spaced evenly by arc length along the left half, from the springline to the apex. */
function evenPoints(curve: [Pt, Pt, Pt, Pt], count: number): Pt[] {
  const dense: Pt[] = [];
  const lengths = [0];
  for (let i = 0; i <= 240; i++) {
    const p = cubic(...curve, i / 240);
    if (i > 0) {
      const prev = dense[i - 1];
      lengths.push(lengths[i - 1] + Math.hypot(p[0] - prev[0], p[1] - prev[1]));
    }
    dense.push(p);
  }
  const total = lengths[lengths.length - 1];
  const out: Pt[] = [];
  let j = 0;
  for (let k = 0; k <= count; k++) {
    const target = (total * k) / count;
    while (j < lengths.length - 1 && lengths[j + 1] < target) j++;
    out.push(dense[j]);
  }
  out[count] = curve[3];
  return out;
}

const f = (n: number) => Math.round(n * 100) / 100;

export function archPath(spec: ArchSpec): string {
  const { cx, width, bottom, spring, lobes = 0 } = spec;
  const x0 = cx - width / 2;
  const x1 = cx + width / 2;
  const [p0, c1, c2, p3] = leftCurve(spec);
  const mirror = ([x, y]: Pt): Pt => [2 * cx - x, y];

  let d = `M${f(x0)} ${f(bottom)} L${f(x0)} ${f(spring)}`;
  if (!lobes) {
    const [m1, m2, m0] = [mirror(c2), mirror(c1), mirror(p0)];
    d += ` C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p3[0])} ${f(p3[1])}`;
    d += ` C${f(m1[0])} ${f(m1[1])} ${f(m2[0])} ${f(m2[1])} ${f(m0[0])} ${f(m0[1])}`;
  } else {
    const left = evenPoints([p0, c1, c2, p3], lobes);
    const right = [...left].reverse().map(mirror);
    const lobe = (a: Pt, b: Pt) => {
      const r = Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.6;
      return ` A${f(r)} ${f(r)} 0 0 1 ${f(b[0])} ${f(b[1])}`;
    };
    for (let i = 1; i < left.length; i++) d += lobe(left[i - 1], left[i]);
    for (let i = 1; i < right.length; i++) d += lobe(right[i - 1], right[i]);
  }
  return `${d} L${f(x1)} ${f(bottom)} Z`;
}

/** Evenly spaced points along the arch outline (jambs + curve), used to string garlands. */
export function archOutlinePoints(spec: ArchSpec, spacing: number): Pt[] {
  const { cx, width, bottom, spring } = spec;
  const curve = leftCurve(spec);
  const curvePts = evenPoints(curve, 240);
  let curveLen = 0;
  for (let i = 1; i < curvePts.length; i++) {
    curveLen += Math.hypot(curvePts[i][0] - curvePts[i - 1][0], curvePts[i][1] - curvePts[i - 1][1]);
  }
  const half: Pt[] = [];
  const x0 = cx - width / 2;
  for (let y = bottom; y > spring; y -= spacing) half.push([x0, y]);
  const n = Math.max(2, Math.round(curveLen / spacing));
  half.push(...evenPoints(curve, n));
  const right = [...half].reverse().slice(1).map(([x, y]): Pt => [2 * cx - x, y]);
  return [...half, ...right];
}
