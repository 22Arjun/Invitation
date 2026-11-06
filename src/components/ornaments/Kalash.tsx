/** A mangal kalash with mango leaves and coconut, in gold line art. */
export function Kalash({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 140" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M60 10 C72 12 78 24 74 38 C70 44 50 44 46 38 C42 24 48 12 60 10Z" pathLength={1} />
      <path d="M60 10 C58 4 62 2 64 0" pathLength={1} />
      <path d="M52 22 Q60 26 68 22 M50 31 Q60 35 70 31" opacity=".7" pathLength={1} />
      {[-1, 1].map((s) => (
        <g key={s} transform={`translate(60 44) scale(${s} 1)`}>
          <path d="M6 0 C18 -6 34 -6 48 2 C34 6 18 6 6 0Z" pathLength={1} />
          <path d="M8 -2 C16 -14 30 -20 44 -18 C34 -10 20 -4 8 -2Z" pathLength={1} />
          <path d="M8 2 C18 12 30 18 42 18 C32 10 20 4 8 2Z" pathLength={1} />
        </g>
      ))}
      <path d="M38 46 H82 M42 46 Q40 52 44 56 H76 Q80 52 78 46" pathLength={1} />
      <path d="M44 56 C20 66 18 104 40 118 H80 C102 104 100 66 76 56" pathLength={1} />
      <path d="M30 80 Q60 90 90 80 M27 92 Q60 102 93 92" opacity=".8" pathLength={1} />
      <path d="M60 64 L64 72 L60 80 L56 72Z M48 104 Q60 110 72 104" pathLength={1} />
      <path d="M44 118 Q42 126 34 130 H86 Q78 126 76 118" pathLength={1} />
      <path d="M30 134 H90" pathLength={1} />
    </svg>
  );
}
