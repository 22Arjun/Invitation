import { archOutlinePoints, archPath, type ArchSpec } from "@/lib/arch";

/**
 * The palace wall, its jharokha window and the marigold garlands, drawn on a single canvas.
 *
 * Scaling a complex SVG (mask + pattern + hundreds of gradient flowers) every scroll frame made the
 * browser re-rasterise it constantly and drop tiles. A canvas is one GPU layer whose cost we control:
 * a few path fills and ~300 pre-rendered flower sprites per frame, redrawn only when something changes.
 */

export const OPENING: ArchSpec = { cx: 800, width: 400, bottom: 1000, spring: 470, apex: 205, lobes: 6 };
const FRAME: ArchSpec = { cx: 800, width: 452, bottom: 1000, spring: 470, apex: 160 };
const FRAME_OUTER: ArchSpec = { cx: 800, width: 480, bottom: 1000, spring: 470, apex: 136 };

/** viewBoxes are [x, y, width, height] in wall units; the mobile one is taller so the window sits lower. */
export const VIEWBOX = {
  desktop: [0, 0, 1600, 1000],
  mobile: [460, -260, 680, 1360],
} as const;

const MOBILE = "(max-width: 767px)";

const OPENING_D = archPath(OPENING);
const FRAME_D = archPath(FRAME);
const FRAME_OUTER_D = archPath(FRAME_OUTER);

type Flower = { x: number; y: number; r: number; rose: boolean };

const FLOWERS: Flower[] = [
  ...archOutlinePoints(FRAME, 15).map(([x, y], i) => ({ x, y, r: 9, rose: i % 7 === 3 })),
  // ladi strands hanging beside the window
  ...[-1, 1].flatMap((side) => Array.from({ length: 9 }, (_, i) => ({ x: 800 + side * 248, y: 486 + i * 15, r: 8, rose: i % 4 === 2 }))),
  // the toran swag drooping across the opening
  ...Array.from({ length: 27 }, (_, i) => {
    const t = i / 26;
    return { x: 600 + 400 * t, y: 470 + Math.sin(Math.PI * t) * 64, r: 8.5, rose: i % 5 === 2 };
  }),
];

const GOLD_STOPS: [number, string][] = [
  [0, "#9a6b22"],
  [0.45, "#efd38e"],
  [1, "#a8752a"],
];

const SPRITE = 160;
const TILE_UNITS = 56;
const TILE_PX = 224;

function offscreen(size: number) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  return [c, c.getContext("2d") as CanvasRenderingContext2D] as const;
}

/** One flower drawn once at high resolution, then stamped with drawImage. */
function flowerSprite(rose: boolean) {
  const [c, g] = offscreen(SPRITE);
  const R = SPRITE * 0.45;
  g.translate(SPRITE / 2, SPRITE / 2);
  const fill = g.createRadialGradient(-R * 0.15, -R * 0.2, 0, 0, 0, R);
  const stops = rose ? ["#f8a5c2", "#d6336c", "#8f0f47"] : ["#ffd25a", "#f59b0c", "#d26a00"];
  fill.addColorStop(0, stops[0]);
  fill.addColorStop(rose ? 0.6 : 0.55, stops[1]);
  fill.addColorStop(1, stops[2]);
  g.fillStyle = fill;
  g.beginPath();
  g.arc(0, 0, rose ? R * 0.92 : R, 0, Math.PI * 2);
  g.fill();
  if (rose) {
    g.strokeStyle = "rgba(125,14,62,.7)";
    g.lineWidth = R * 0.12;
    g.beginPath();
    g.arc(0, 0, R * 0.35, Math.PI, 0);
    g.arc(R * 0.12, 0, R * 0.22, 0, Math.PI);
    g.stroke();
  } else {
    g.strokeStyle = "rgba(196,95,0,.45)";
    g.lineWidth = R * 0.32;
    g.setLineDash([R * 0.17, R * 0.14]);
    g.beginPath();
    g.arc(0, 0, R * 0.82, 0, Math.PI * 2);
    g.stroke();
    g.setLineDash([]);
    g.fillStyle = "rgba(181,83,10,.55)";
    g.beginPath();
    g.arc(0, 0, R * 0.28, 0, Math.PI * 2);
    g.fill();
  }
  return { canvas: c, unitsPerPx: 1 / R };
}

/** The jaali: interlocking circles, like the card's gold lattice. */
function jaaliTile() {
  const [c, g] = offscreen(TILE_PX);
  const s = TILE_PX / TILE_UNITS;
  g.scale(s, s);
  g.strokeStyle = "rgba(200,150,62,.32)";
  g.lineWidth = 0.7;
  for (const [x, y, r] of [
    [0, 0, 28],
    [56, 0, 28],
    [0, 56, 28],
    [56, 56, 28],
    [28, 28, 28],
    [28, 28, 4],
  ]) {
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.stroke();
  }
  return c;
}

const easeBack = (t: number) => {
  const c1 = 2.4;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

export function createWallRenderer(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  const marigold = flowerSprite(false);
  const rose = flowerSprite(true);
  const pattern = ctx.createPattern(jaaliTile(), "repeat");
  pattern?.setTransform(new DOMMatrix().scale(TILE_UNITS / TILE_PX));

  const opening = new Path2D(OPENING_D);
  const outer = new Path2D(FRAME_OUTER_D);
  const frame = new Path2D(FRAME_D);
  const withHole = (shape: Path2D) => {
    const p = new Path2D(shape);
    p.addPath(opening);
    return p;
  };
  const wall = new Path2D();
  wall.rect(-6000, -6000, 14000, 14000);
  wall.addPath(opening);
  const outerBand = withHole(outer);
  const frameBand = withHole(frame);
  const finial = new Path2D("M780 140 Q800 104 820 140Z M798 92 L800 66 L802 92Z");
  const tassels = new Path2D("M547 620 L552 642 L557 620Z M1043 620 L1048 642 L1053 620Z");

  /** zoom: 1 at rest; intro: 0 → 1 as the garland flowers pop in. */
  const state = { zoom: 1, intro: 1 };
  let W = 0;
  let H = 0;
  let dpr = 1;
  let k = 1;
  let ucx = 800;
  let ucy = 500;
  let ox = 0;
  let oy = 0;
  let maxZoom = 4;
  let box: readonly number[] = VIEWBOX.desktop;

  function resize() {
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    box = window.matchMedia(MOBILE).matches ? VIEWBOX.mobile : VIEWBOX.desktop;
    const [vx, vy, vw, vh] = box;
    // preserveAspectRatio="xMidYMid slice"
    k = Math.max(W / vw, H / vh);
    ucx = vx + vw / 2;
    ucy = vy + vh / 2;
    const sx = (u: number) => W / 2 + (u - ucx) * k;
    const sy = (u: number) => H / 2 + (u - ucy) * k;
    const left = sx(OPENING.cx - OPENING.width / 2);
    const right = sx(OPENING.cx + OPENING.width / 2);
    const top = sy(OPENING.spring);
    const bottom = sy(OPENING.bottom);
    // Zoom about the centre of the window's rectangular opening until it swallows the viewport.
    ox = (left + right) / 2;
    oy = (top + bottom) / 2;
    maxZoom = Math.max(ox / (ox - left), (W - ox) / (right - ox), oy / (oy - top), (H - oy) / Math.max(bottom - oy, 1)) * 1.08;
  }

  function render() {
    if (!W || !H) return;
    const z = state.zoom;
    const s = k * z;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(s * dpr, 0, 0, s * dpr, dpr * (ox + (W / 2 - ucx * k - ox) * z), dpr * (oy + (H / 2 - ucy * k - oy) * z));

    const [vx, vy, vw, vh] = box;
    const light = ctx.createRadialGradient(vx + vw / 2, vy + vh * 0.55, 0, vx + vw / 2, vy + vh * 0.55, Math.max(vw, vh) * 0.65);
    light.addColorStop(0, "#fffaf0");
    light.addColorStop(1, "#f3e3c7");
    ctx.fillStyle = light;
    ctx.fill(wall, "evenodd");
    if (pattern) {
      ctx.fillStyle = pattern;
      ctx.fill(wall, "evenodd");
    }

    const gold = ctx.createLinearGradient(560, 130, 1040, 1000);
    for (const [o, c] of GOLD_STOPS) gold.addColorStop(o, c);

    ctx.fillStyle = "#f7ead2";
    ctx.fill(outerBand, "evenodd");
    ctx.strokeStyle = gold;
    ctx.lineWidth = 2.5;
    ctx.stroke(outer);
    ctx.fillStyle = "#fbf2e2";
    ctx.fill(frameBand, "evenodd");
    ctx.lineWidth = 1.2;
    ctx.stroke(frame);

    // The reveal: a soft inner shadow gives the window its depth.
    ctx.save();
    ctx.clip(opening);
    ctx.strokeStyle = "rgba(74,10,38,.28)";
    ctx.lineWidth = 26;
    ctx.stroke(opening);
    ctx.restore();
    ctx.strokeStyle = gold;
    ctx.lineWidth = 2.2;
    ctx.stroke(opening);

    ctx.fillStyle = gold;
    ctx.fill(finial);
    ctx.beginPath();
    ctx.arc(800, 98, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(770, 142);
    ctx.lineTo(830, 142);
    ctx.stroke();

    const intro = state.intro;
    if (intro > 0.8) ctx.fill(tassels);

    // Visible area in wall units, to skip flowers that are off-screen at high zoom.
    const inv = 1 / s;
    const x0 = ((0 - (ox + (W / 2 - ucx * k - ox) * z)) * inv) - 20;
    const y0 = ((0 - (oy + (H / 2 - ucy * k - oy) * z)) * inv) - 20;
    const x1 = x0 + W * inv + 40;
    const y1 = y0 + H * inv + 40;

    const n = FLOWERS.length;
    for (let i = 0; i < n; i++) {
      const f = FLOWERS[i];
      if (f.x < x0 || f.x > x1 || f.y < y0 || f.y > y1) continue;
      // Each flower pops in on its own beat, from the bottom of the strands up to the apex.
      const local = Math.min(1, Math.max(0, intro * 1.6 - (1 - i / n) * 0.6));
      if (local <= 0) continue;
      const scale = local >= 1 ? 1 : easeBack(local);
      const sprite = f.rose ? rose : marigold;
      const size = SPRITE * sprite.unitsPerPx * f.r * scale;
      ctx.drawImage(sprite.canvas, f.x - size / 2, f.y - size / 2, size, size);
    }
  }

  return {
    state,
    resize,
    render,
    get maxZoom() {
      return maxZoom;
    },
  };
}
