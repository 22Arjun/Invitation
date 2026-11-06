"use client";

import { COUPLE, UI } from "@/content/wedding";
import { useLang } from "@/lib/lang";
import { Mandala } from "@/components/ornaments/Mandala";
import { Split } from "@/components/ornaments/Split";
import { ArchOutline } from "./ArchOutline";

function Person({ who }: { who: "groom" | "bride" }) {
  const { t } = useLang();
  const p = COUPLE[who];
  return (
    <article className={`person person--${who}`} data-reveal="fade">
      <div className="person__arch">
        <div className="person__arch-fill bg-jaali">
          <Mandala className="person__mandala" core={false} />
          <span className="person__initial text-foil">{t(p.initial)}</span>
        </div>
        <ArchOutline className="person__outline" />
      </div>
      <p className="person__honorific" lang="hi">
        {p.honorific.hi}
      </p>
      <h3 className="person__name">{t(p.full)}</h3>
      <p className="person__family">{t(p.family)}</p>
      <dl className="person__lineage">
        {p.lineage.map((line) => (
          <div key={line.label.en}>
            <dt>{t(line.label)}</dt>
            <dd>{t(line.value)}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

export function Couple() {
  const { t } = useLang();
  return (
    <section id="couple" className="couple" data-theme="cream">
      <header className="section-head section-head--center">
        <p className="eyebrow" data-reveal="fade">
          {t(UI.couple.eyebrow)}
        </p>
        <h2 className="display" data-reveal="split">
          <Split text={t(UI.couple.title)} />
        </h2>
      </header>
      <div className="couple__grid">
        <Person who="groom" />
        <div className="couple__with" data-reveal="fade" aria-hidden="true">
          <span className="couple__amp">&amp;</span>
          <span className="couple__sang" lang="hi">
            संग
          </span>
        </div>
        <Person who="bride" />
      </div>
    </section>
  );
}
