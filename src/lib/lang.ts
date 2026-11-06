"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Lang, Text } from "@/content/wedding";

const KEY = "shaadi-lang";
const listeners = new Set<() => void>();
let current: Lang | null = null;

function read(): Lang {
  if (current) return current;
  try {
    current = localStorage.getItem(KEY) === "hi" ? "hi" : "en";
  } catch {
    current = "en";
  }
  return current;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

/** True once this visitor has chosen a language (or been given one by their invitation). */
export function hasLangPreference() {
  try {
    return localStorage.getItem(KEY) !== null;
  } catch {
    return false;
  }
}

export function setLang(lang: Lang) {
  current = lang;
  try {
    localStorage.setItem(KEY, lang);
  } catch {
    // Storage can be unavailable (private mode); the choice still applies for this visit.
  }
  document.documentElement.lang = lang;
  listeners.forEach((fn) => fn());
}

export function useLang() {
  const lang = useSyncExternalStore(subscribe, read, () => "en" as Lang);
  const t = useCallback((text: Text) => text[lang], [lang]);
  return { lang, t };
}
