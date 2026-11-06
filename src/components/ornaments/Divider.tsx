/** The card's gold rule with a four-point star at its centre. */
export function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`divider ${className}`} data-reveal="divider" aria-hidden="true">
      <span className="divider__line divider__line--l" />
      <svg viewBox="0 0 24 24" className="divider__star">
        <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0Z" fill="currentColor" />
      </svg>
      <span className="divider__line divider__line--r" />
    </div>
  );
}
