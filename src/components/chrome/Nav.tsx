"use client";

import { useEffect, useEffectEvent, useRef, useState, type MouseEvent } from "react";
import { COUPLE, KEY_EVENTS, UI } from "@/content/wedding";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { setLang, useLang } from "@/lib/lang";
import { lockScroll, scrollToTarget } from "@/lib/scroll";
import { Mandala } from "@/components/ornaments/Mandala";

export function Nav() {
  const { lang, t } = useLang();
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  // Keeps :lang() typography (and screen readers) in step with a language restored from storage.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useGSAP(() => {
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        header.current?.classList.toggle("is-hidden", self.direction === 1 && y > 260);
        header.current?.classList.toggle("is-solid", y > 80);
      },
    });
  });

  useEffect(() => () => void timeline.current?.kill(), []);

  function openMenu() {
    const el = menu.current;
    const btn = button.current;
    if (!el || !btn) return;
    const r = btn.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy));
    setOpen(true);
    lockScroll(true);
    timeline.current?.kill();
    timeline.current = gsap
      .timeline()
      .set(el, { visibility: "visible" })
      .fromTo(el, { clipPath: `circle(0px at ${cx}px ${cy}px)` }, { clipPath: `circle(${radius}px at ${cx}px ${cy}px)`, duration: 1.1, ease: "expo.inOut" })
      .fromTo(el.querySelectorAll(".menu__link-inner"), { yPercent: 115 }, { yPercent: 0, stagger: 0.06, duration: 1.1, ease: "expo.out" }, 0.45)
      .fromTo(el.querySelectorAll(".menu__aside > *"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.9, ease: "expo.out" }, 0.6)
      .fromTo(el.querySelector(".menu__mandala"), { autoAlpha: 0 }, { autoAlpha: 0.25, duration: 2, ease: "expo.out" }, 0.4);
  }

  function closeMenu(then?: () => void) {
    const tl = timeline.current;
    setOpen(false);
    if (!tl) return;
    tl.eventCallback("onReverseComplete", () => {
      gsap.set(menu.current, { visibility: "hidden" });
      lockScroll(false);
      then?.();
    });
    tl.timeScale(1.7).reverse();
  }

  const onEscape = useEffectEvent(() => closeMenu());

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onEscape();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    closeMenu(() => scrollToTarget(href));
  };

  return (
    <>
      <header ref={header} className="nav" data-theme="cream">
        <a href="#top" className="nav__logo" aria-label={`${t(COUPLE.groom.name)} & ${t(COUPLE.bride.name)}`}>
          <span>{t(COUPLE.groom.initial)}</span>
          <em>&amp;</em>
          <span>{t(COUPLE.bride.initial)}</span>
        </a>
        <div className="nav__right">
          <button type="button" className="nav__lang" onClick={() => setLang(lang === "en" ? "hi" : "en")} aria-label={t(UI.langSwitch)} data-cursor={lang === "en" ? "हिन्दी" : "English"}>
            <span className={lang === "en" ? "is-active" : ""}>EN</span>
            <span className={lang === "hi" ? "is-active" : ""} lang="hi">
              हिं
            </span>
            <i aria-hidden="true" data-pos={lang} />
          </button>
          <a href="#rsvp" className="nav__rsvp" data-magnetic>
            {t(UI.rsvp)}
          </a>
          <button
            ref={button}
            type="button"
            className={`nav__menu ${open ? "is-open" : ""}`}
            aria-expanded={open}
            aria-controls="menu"
            onClick={() => (open ? closeMenu() : openMenu())}
            data-magnetic
          >
            <span className="nav__menu-label">{open ? t(UI.close) : t(UI.menu)}</span>
            <span className="nav__burger" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </header>

      <div id="menu" ref={menu} className="menu" aria-hidden={!open} inert={!open}>
        <div className="menu__bg bg-jaali" />
        <div className="menu__inner">
          <nav aria-label="Sections">
            <ol className="menu__list">
              {UI.nav.map((item, i) => (
                <li key={item.href}>
                  <a href={item.href} className="menu__link" data-menu-link onClick={(e) => go(e, item.href)}>
                    <span className="menu__link-inner">
                      <span className="menu__num">0{i + 1}</span>
                      <span className="menu__label">{t(item.label)}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <aside className="menu__aside">
            <Mandala className="menu__mandala" core={false} />
            <p className="menu__invocation" lang="hi">
              {UI.invocation}
            </p>
            <p className="menu__names">
              {t(COUPLE.groom.name)} <em>&amp;</em> {t(COUPLE.bride.name)}
            </p>
            {KEY_EVENTS.map((e) => (
              <p key={e.id} className="menu__meta">
                <span>{t(e.short)}</span> {t(e.weekday)}, {e.day} {t(e.month)}
              </p>
            ))}
            <p className="menu__meta">{t(UI.hero.place)}</p>
          </aside>
        </div>
      </div>
    </>
  );
}
