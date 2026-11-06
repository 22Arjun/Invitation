"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import type { Guest } from "@/lib/guest";
import { hasLangPreference, setLang } from "@/lib/lang";

const GuestContext = createContext<Guest | null>(null);

/** Makes the invited guest (if the page was opened from a personal link) available to every section. */
export function GuestProvider({ guest, children }: { guest: Guest | null; children: ReactNode }) {
  // A Hindi invitation opens the site in Hindi, unless this visitor has already picked a language.
  useEffect(() => {
    if (guest && !hasLangPreference()) setLang(guest.lang);
  }, [guest]);

  return <GuestContext value={guest}>{children}</GuestContext>;
}

export const useGuest = () => useContext(GuestContext);
