import { EVENTS, VENUE } from "@/content/wedding";
import { plain } from "@/components/ornaments/Split";

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

/** Downloads an .ics file with all four ceremonies. */
export function downloadIcs() {
  const url = URL.createObjectURL(new Blob([buildIcs()], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "harshraj-archana-wedding.ics";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const first = EVENTS[0];

/** Google Calendar link for the Lagun & Phaldan evening, the event guests are invited to. */
export const GOOGLE_CALENDAR = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
  `${plain(first.title.en)} · Harshraj & Archana`,
)}&dates=${icsDate(first.start)}/${icsDate(new Date(new Date(first.start).getTime() + 6 * 3600_000).toISOString())}&location=${encodeURIComponent(
  `${VENUE.name.en}, ${VENUE.address.en}`,
)}&details=${encodeURIComponent(first.description.en)}`;

export const DIRECTIONS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(VENUE.mapsQuery)}`;
