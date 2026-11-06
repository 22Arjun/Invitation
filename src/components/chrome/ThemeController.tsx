"use client";

import { ScrollTrigger, useGSAP } from "@/lib/gsap";

const THEME_COLOR: Record<string, string> = {
  cream: "#fbf4e8",
  blush: "#f7e1dc",
  wine: "#4a0a26",
  rani: "#9c1250",
  night: "#22060f",
};

/**
 * Sections paint their own palettes, so only the fixed nav (and the browser's theme-color) needs to
 * follow the section beneath it. Scoping the change to the nav keeps it to a tiny style update.
 */
export function setTheme(theme: string) {
  const nav = document.querySelector<HTMLElement>(".nav");
  if (!nav || nav.dataset.theme === theme) return;
  nav.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme] ?? THEME_COLOR.cream);
}

/** Switches the nav's palette as each [data-theme] section passes beneath it. */
export function ThemeController() {
  useGSAP(() => {
    document.querySelectorAll<HTMLElement>("main [data-theme], footer[data-theme]").forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 48px",
        end: "bottom 48px",
        onToggle: (self) => {
          if (self.isActive) setTheme(section.dataset.theme ?? "cream");
        },
      });
    });
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  });
  return null;
}
