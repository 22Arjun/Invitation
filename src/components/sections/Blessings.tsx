"use client";

import { FAMILY, UI, type Text } from "@/content/wedding";
import { useLang } from "@/lib/lang";
import { Divider } from "@/components/ornaments/Divider";
import { Split } from "@/components/ornaments/Split";

function Card({ title, names, footer, className = "" }: { title: Text; names: Text[]; footer?: Text; className?: string }) {
  const { lang, t } = useLang();
  return (
    <article className={`bless ${className}`} data-reveal="fade">
      <h3 className="bless__title">
        <span lang="hi">{title.hi}</span>
        {lang === "en" && <small>{title.en}</small>}
      </h3>
      <ul className="bless__names">
        {names.map((n) => (
          <li key={n.en}>{t(n)}</li>
        ))}
      </ul>
      {footer && <p className="bless__footer">{t(footer)}</p>}
    </article>
  );
}

export function Blessings() {
  const { lang, t } = useLang();
  const { senders, vineet, darshanabhilashi, buaPhoopha, organiser } = FAMILY;
  return (
    <section id="blessings" className="blessings" data-theme="blush">
      <header className="section-head section-head--center">
        <p className="eyebrow" data-reveal="fade">
          {t(UI.blessings.eyebrow)}
        </p>
        <h2 className="display" data-reveal="split">
          <Split text={t(UI.blessings.title)} />
        </h2>
      </header>

      <div className="blessings__grid">
        <Card title={senders.title} names={senders.names} footer={senders.address} className="bless--senders" />
        <Card title={vineet.title} names={vineet.names} />
        <Card title={buaPhoopha.title} names={buaPhoopha.names} />
        <Card title={organiser.title} names={organiser.names} />
      </div>

      <Divider />

      <div className="darshan">
        <h3 className="bless__title bless__title--center" data-reveal="fade">
          <span lang="hi">{darshanabhilashi.title.hi}</span>
          {lang === "en" && <small>{darshanabhilashi.title.en}</small>}
        </h3>
        <p className="darshan__names" data-reveal="stagger">
          {darshanabhilashi.names.map((n) => (
            <span key={n.en} className="darshan__name">
              {t(n)}
            </span>
          ))}
        </p>
        <p className="darshan__family" data-reveal="fade">
          — {t(darshanabhilashi.footer)} —
        </p>
      </div>
    </section>
  );
}
