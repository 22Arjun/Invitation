"use client";

import { UI, VENUE } from "@/content/wedding";
import { useLang } from "@/lib/lang";
import { Badge } from "@/components/ornaments/Badge";
import { Mandala } from "@/components/ornaments/Mandala";
import { Split } from "@/components/ornaments/Split";
import { ArchOutline } from "./ArchOutline";

const MAP_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(VENUE.mapsQuery)}&z=15&output=embed`;
const DIRECTIONS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(VENUE.mapsQuery)}`;

export function Venue() {
  const { t } = useLang();
  return (
    <section id="venue" className="venue" data-theme="cream">
      <div className="venue__grid">
        <div className="venue__text">
          <p className="eyebrow" data-reveal="fade">
            {t(UI.venue.eyebrow)}
          </p>
          <h2 className="display display--sm" data-reveal="split">
            <Split text={t(VENUE.name)} />
          </h2>
          <p className="venue__address" data-reveal="fade">
            {t(VENUE.address)}
          </p>
          <p className="venue__when" data-reveal="fade">
            {t(UI.venue.when)}
          </p>
          <div className="venue__actions" data-reveal="fade">
            <a className="btn" href={DIRECTIONS} target="_blank" rel="noopener noreferrer" data-magnetic>
              <span>{t(UI.venue.directions)}</span>
              <i aria-hidden="true">↗</i>
            </a>
          </div>
          <div className="venue__travel" data-reveal="stagger">
            <p className="eyebrow">{t(UI.venue.gettingThere)}</p>
            {UI.venue.travel.map((row) => (
              <p key={row.label.en} className="venue__travel-row">
                <span>{t(row.label)}</span>
                <span>{t(row.value)}</span>
              </p>
            ))}
          </div>
        </div>

        <div className="venue__map" data-reveal="fade">
          <Badge text={t(UI.venue.ring)} className="venue__badge">
            <svg viewBox="0 0 24 24" aria-hidden="true" width="22" height="22">
              <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" fill="currentColor" />
            </svg>
          </Badge>
          <div className="venue__arch">
            {/* Shown until the map loads, and stays if a browser blocks the embed. */}
            <a className="venue__fallback bg-jaali" href={DIRECTIONS} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true">
              <Mandala className="venue__fallback-mandala" core={false} />
              <svg viewBox="0 0 24 24" width="40" height="40">
                <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" fill="currentColor" />
              </svg>
              <span>{t(VENUE.name)}</span>
              <small>{t(UI.venue.directions)} ↗</small>
            </a>
            <iframe src={MAP_EMBED} title={`${t(VENUE.name)} map`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
          <ArchOutline className="venue__outline" />
        </div>
      </div>
    </section>
  );
}
