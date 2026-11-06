/** A lightweight canvas petal system: bursts from a point, or a gentle shower from the top. */

type Petal = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  size: number;
  color: string;
  phase: number;
  flutter: number;
  born: number;
  ttl: number;
};

const COLORS = ["#c2185b", "#e0457b", "#f48fb1", "#f29a1d", "#ffb627", "#e9c982", "#b3135a"];

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let petals: Petal[] = [];
let raf = 0;
let dpr = 1;

function ensureCanvas() {
  if (canvas) return;
  canvas = document.createElement("canvas");
  canvas.className = "petal-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);
  ctx = canvas.getContext("2d");
  const resize = () => {
    if (!canvas) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
  };
  resize();
  window.addEventListener("resize", resize);
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);

function spawn(x: number, y: number, vx: number, vy: number): Petal {
  return {
    x,
    y,
    vx,
    vy,
    rot: rand(0, Math.PI * 2),
    vr: rand(-0.12, 0.12),
    size: rand(7, 15),
    color: COLORS[(Math.random() * COLORS.length) | 0],
    phase: rand(0, Math.PI * 2),
    flutter: rand(0.02, 0.06),
    born: performance.now(),
    ttl: rand(5200, 8200),
  };
}

function drawPetal(p: Petal, alpha: number) {
  if (!ctx) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(p.x * dpr, p.y * dpr);
  ctx.rotate(p.rot);
  // Foreshorten with the flutter phase so petals appear to tumble in 3D.
  ctx.scale(dpr, dpr * Math.abs(Math.cos(p.phase)) * 0.85 + 0.15 * dpr);
  ctx.fillStyle = p.color;
  ctx.beginPath();
  const s = p.size;
  ctx.moveTo(0, -s);
  ctx.bezierCurveTo(s * 0.75, -s * 0.6, s * 0.6, s * 0.55, 0, s * 0.7);
  ctx.bezierCurveTo(-s * 0.6, s * 0.55, -s * 0.75, -s * 0.6, 0, -s);
  ctx.fill();
  ctx.globalAlpha = alpha * 0.25;
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.ellipse(-s * 0.15, -s * 0.3, s * 0.18, s * 0.42, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function tick(now: number) {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const h = window.innerHeight;
  petals = petals.filter((p) => p.y < h + 40 && now - p.born < p.ttl);
  for (const p of petals) {
    const age = (now - p.born) / p.ttl;
    p.phase += p.flutter * 2;
    p.vx *= 0.985;
    p.vy = p.vy * 0.985 + 0.06;
    p.x += p.vx + Math.sin(p.phase) * 0.6;
    p.y += Math.min(p.vy, 3.2);
    p.rot += p.vr;
    drawPetal(p, age > 0.75 ? (1 - age) / 0.25 : 1);
  }
  if (petals.length) raf = requestAnimationFrame(tick);
  else {
    raf = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function start() {
  if (!raf) raf = requestAnimationFrame(tick);
}

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function burstPetals(x: number, y: number, count = 90) {
  if (reduced()) return;
  ensureCanvas();
  for (let i = 0; i < count; i++) {
    const angle = rand(-Math.PI * 0.95, -Math.PI * 0.05);
    const speed = rand(4, 13);
    petals.push(spawn(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed));
  }
  start();
}

export function showerPetals(count = 70) {
  if (reduced()) return;
  ensureCanvas();
  const w = window.innerWidth;
  for (let i = 0; i < count; i++) {
    petals.push(spawn(rand(0, w), rand(-window.innerHeight * 0.6, -20), rand(-0.6, 0.6), rand(1, 2.2)));
  }
  start();
}
