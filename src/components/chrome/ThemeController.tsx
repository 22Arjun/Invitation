"use client";

import { ScrollTrigger, useGSAP } from "@/lib/gsap";

const THEME_COLOR: Record<string, string> = {
  cream: "#fbf4e8",
  blush: "#f7e1dc",
  wine: "#4a0a26",
  rani: "#9c1250",
  night: "#22060f",
};

export function setTheme(theme: string) {
  if (document.body.dataset.theme === theme) return;
  document.body.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme] ?? THEME_COLOR.cream);
}

/** Cross-fades the page palette as each [data-theme] section crosses the middle of the viewport. */
export function ThemeController() {
  useGSAP(() => {
    document.querySelectorAll<HTMLElement>("main [data-theme], footer[data-theme]").forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => {
          if (self.isActive) setTheme(section.dataset.theme ?? "cream");
        },
      });
    });
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  });
  return null;
}
