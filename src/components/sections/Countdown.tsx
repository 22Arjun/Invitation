"use client";

import { useEffect, useState } from "react";
import { EVENTS, UI, VENUE, type WeddingEvent } from "@/content/wedding";
import { useLang } from "@/lib/lang";
import { Diya } from "@/components/ornaments/Diya";
import { Mandala } from "@/components/ornaments/Mandala";
import { Rich, Split, plain } from "@/components/ornaments/Split";

const DIGITS = "0123456789".split("");

function Digits({ value, length }: { value: number | null; length: number }) {
  const str = value === null ? "-".repeat(length) : String(value).padStart(length, "0");
  return (
    <span className="cd__num">
      {str.split("").map((ch, i) => (
        <span key={i} className="digit">
          <span className="digit__strip" style={{ transform: `translateY(${ch === "-" ? 0 : -Number(ch) * 10}%)` }}>
            {DIGITS.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}

const icsDate = (iso: string) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, "");

function buildIcs() {
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Harshraj & Archana//Shubh Vivah//EN", "CALSCALE:GREGORIAN"];
  const stamp = icsDate(new Date().toISOString());
  for (const e of EVENTS) {
    const title = plain(e.title.en);
    lines.push("BEGIN:VEVENT", `UID:${e.id}-2026@harshraj-archana`, `DTSTAMP:${stamp}`);
    if (e.allDay) {
      const [y, m, d] = e.start.slice(0, 10).split("-").map(Number);
      const ymd = (date: Date) => date.toISOString().slice(0, 10).replace(/-/g, "");
      lines.push(`DTSTART;VALUE=DATE:${ymd(new Date(Date.UTC(y, m - 1, d)))}`, `DTEND;VALUE=DATE:${ymd(new Date(Date.UTC(y, m - 1, d + 1)))}`);
    } else {
      const end = new Date(new Date(e.start).getTime() + 6 * 3600_000).toISOString();
      lines.push(`DTSTART:${icsDate(e.start)}`, `DTEND:${icsDate(end)}`, `LOCATION:${VENUE.name.en}\\, ${VENUE.address.en.replace(/,/g, "\\,")}`);
    }
    lines.push(`SUMMARY:${title} · Harshraj & Archana`, `DESCRIPTION:${e.description.en.replace(/,/g, "\\,")}`, "END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

function downloadIcs() {
  const url = URL.createObjectURL(new Blob([buildIcs()], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "harshraj-archana-wedding.ics";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const first = EVENTS[0];
const GOOGLE = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
  `${plain(first.title.en)} · Harshraj & Archana`,
)}&dates=${icsDate(first.start)}/${icsDate(new Date(new Date(first.start).getTime() + 6 * 3600_000).toISOString())}&location=${encodeURIComponent(
  `${VENUE.name.en}, ${VENUE.address.en}`,
)}&details=${encodeURIComponent(first.description.en)}`;

function nextEvent(now: number): WeddingEvent | undefined {
  return EVENTS.find((e) => new Date(e.start).getTime() > now);
}

export function Countdown() {
  const { t } = useLang();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const raf = requestAnimationFrame(tick);
    const id = window.setInterval(tick, 1000);
    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(id);
    };
  }, []);

  const upcoming = now === null ? first : nextEvent(now);
  const diff = upcoming && now !== null ? Math.max(0, new Date(upcoming.start).getTime() - now) : null;
  const parts =
    diff === null
      ? [null, null, null, null]
      : [Math.floor(diff / 86_400_000), Math.floor(diff / 3_600_000) % 24, Math.floor(diff / 60_000) % 60, Math.floor(diff / 1000) % 60];

  return (
    <section id="countdown" className="countdown" data-theme="wine" aria-labelledby="countdown-title">
      <Mandala className="countdown__mandala" core={false} />
      <div className="countdown__inner">
        <p className="eyebrow eyebrow--center" data-reveal="fade">
          {t(UI.countdown.eyebrow)}
        </p>
        <h2 id="countdown-title" className="display display--sm" data-reveal="split">
          <Split text={t(upcoming ? UI.countdown.until : UI.countdown.married)} />
        </h2>

        {upcoming ? (
          <>
            <p className="countdown__next" data-reveal="fade">
              <Rich text={t(upcoming.title)} /> · {upcoming.day} {t(upcoming.month)}
            </p>
            <div className="countdown__grid" role="timer" aria-live="off">
              {UI.countdown.units.map((unit, i) => (
                <div key={unit.en} className="cd">
                  <Digits value={parts[i]} length={i === 0 && (parts[0] ?? 0) > 99 ? 3 : 2} />
                  <span className="cd__label">{t(unit)}</span>
                </div>
              ))}
            </div>
            <div className="countdown__actions" data-reveal="fade">
              <button type="button" className="btn btn--gold" onClick={downloadIcs} data-magnetic>
                <span>{t(UI.countdown.addToCalendar)}</span>
                <i aria-hidden="true">+</i>
              </button>
              <a className="link-underline" href={GOOGLE} target="_blank" rel="noopener noreferrer">
                {t(UI.countdown.google)}
              </a>
            </div>
          </>
        ) : (
          <p className="countdown__next">{t(UI.countdown.marriedNote)}</p>
        )}
      </div>
      <div className="countdown__diyas" aria-hidden="true">
        {Array.from({ length: 9 }, (_, i) => (
          <Diya key={i} delay={(i * 0.37) % 1.3} className={i % 2 ? "diya--sm" : ""} />
        ))}
      </div>
    </section>
  );
}
