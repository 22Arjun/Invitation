"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CREDIT } from "@/content/wedding";
import { gsap, useGSAP } from "@/lib/gsap";
import { onIntro } from "@/lib/intro";
import { burstPetals } from "@/lib/petals";
import { Mandala } from "@/components/ornaments/Mandala";

const GITHUB_MARK =
  "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z";

/**
 * The hidden designer credit. Nothing shows until someone knows how to ask:
 * - tap the "H & A" monogram in the nav 7 times quickly (phones and computers)
 * - type the secret word anywhere on the page (computers)
 * - open the site with ?credits on the end of the address
 * Anyone who opens the browser console also finds a signature there.
 */
export function Credits() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const reveal = useCallback(() => setOpen(true), []);

  // The console signature, with a hint for the curious.
  useEffect(() => {
    console.log(`%c✦ ${CREDIT.by} ${CREDIT.name} ✦`, "font: italic 22px Georgia, serif; color: #c8963e; padding: 10px 0");
    console.log(`%c${CREDIT.github}`, "font: 13px system-ui, sans-serif; color: #c8963e");
    console.log(`%cpsst… tap the H & A ${CREDIT.taps} times.`, "font: 12px system-ui, sans-serif; color: #b3135a");
  }, []);

  // The secret link: ?credits, shown once the doors have opened.
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("credits")) return;
    let timer = 0;
    const off = onIntro(() => {
      timer = window.setTimeout(reveal, 900);
    });
    return () => {
      off();
      window.clearTimeout(timer);
    };
  }, [reveal]);

  // The secret word, typed anywhere except inside a form field.
  useEffect(() => {
    let typed = "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key.length !== 1 || (e.target as Element).closest?.("input, textarea, select, [contenteditable]")) return;
      typed = (typed + e.key.toLowerCase()).slice(-CREDIT.secretWord.length);
      if (typed === CREDIT.secretWord) reveal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [reveal]);

  // The secret tap: the monogram, several times in quick succession.
  useEffect(() => {
    let taps = 0;
    let timer = 0;
    const onClick = (e: MouseEvent) => {
      if (!(e.target as Element).closest(".nav__logo")) return;
      taps += 1;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => (taps = 0), 1500);
      if (taps >= CREDIT.taps) {
        taps = 0;
        reveal();
      }
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      window.clearTimeout(timer);
    };
  }, [reveal]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    root.current?.querySelector<HTMLButtonElement>(".credits__close")?.focus({ preventScroll: true });
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useGSAP(
    () => {
      if (!open) return;
      burstPetals(window.innerWidth / 2, window.innerHeight * 0.62, 110);
      gsap
        .timeline()
        .fromTo(".credits__card", { y: 40, scale: 0.94, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 1, ease: "expo.out" })
        .fromTo(
          ".credits__mandala path, .credits__mandala circle, .credits__mandala line",
          { strokeDasharray: 1, strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 2.2, ease: "power2.inOut", stagger: { amount: 0.8 } },
          0,
        )
        .fromTo(".credits__by, .credits__name, .credits__link", { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.12, duration: 1.1, ease: "expo.out" }, 0.25);
    },
    { scope: root, dependencies: [open] },
  );

  return (
    <div
      ref={root}
      className={`credits${open ? " is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${CREDIT.by} ${CREDIT.name}`}
      aria-hidden={!open}
      inert={!open}
      onClick={(e) => e.target === e.currentTarget && setOpen(false)}
    >
      <div className="credits__card">
        <Mandala className="credits__mandala" core={false} />
        <p className="credits__by">{CREDIT.by}</p>
        <p className="credits__name text-foil">{CREDIT.name}</p>
        <a className="credits__link" href={CREDIT.github} target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <path fill="currentColor" d={GITHUB_MARK} />
          </svg>
          <span>{CREDIT.github.replace("https://", "")}</span>
        </a>
        <button type="button" className="credits__close" onClick={() => setOpen(false)} aria-label="Close">
          ×
        </button>
      </div>
    </div>
  );
}
