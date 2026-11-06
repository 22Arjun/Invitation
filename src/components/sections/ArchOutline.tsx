import { archPath } from "@/lib/arch";

/** One arch, in a 1000×1000 box, shared by the clip path and its gold outline so they stretch identically. */
const ARCH_D = archPath({ cx: 500, width: 1000, bottom: 1000, spring: 372, apex: 0, lobes: 6 });
const INNER_D = archPath({ cx: 500, width: 936, bottom: 1000, spring: 395, apex: 40 });

/** Gold double outline that traces the #arch clip path of its container. */
export function ArchOutline({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1000 1000" preserveAspectRatio="none" fill="none" overflow="visible" aria-hidden="true" data-reveal="draw">
      <path d={ARCH_D} stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" pathLength={1} />
      <path d={INNER_D} stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" opacity=".55" pathLength={1} />
    </svg>
  );
}

/** Shared clip paths, rendered once in the page. */
export function ArchDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <clipPath id="arch" clipPathUnits="objectBoundingBox">
          <path d={ARCH_D} transform="scale(0.001)" />
        </clipPath>
      </defs>
    </svg>
  );
}
