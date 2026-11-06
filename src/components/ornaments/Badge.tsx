import { useId, type ReactNode } from "react";

/** Circular text that slowly rotates around a centre glyph. */
export function Badge({ text, children, className = "" }: { text: string; children: ReactNode; className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <span className={`badge ${className}`} aria-hidden="true">
      <svg viewBox="0 0 120 120" className="badge__ring">
        <defs>
          <path id={`c${id}`} d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
        </defs>
        <text>
          <textPath href={`#c${id}`} textLength="286" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <span className="badge__center">{children}</span>
    </span>
  );
}
