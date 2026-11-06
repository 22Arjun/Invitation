# Harshraj & Archana · शुभ विवाह

An animated, bilingual (English / हिन्दी) wedding website for the Rajawat and Bhadauria families.
Built with **Next.js 16 (App Router)**, **Tailwind CSS v4**, **GSAP + ScrollTrigger** and **Lenis** smooth scrolling.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # production
```

## Editing names, dates and text

Everything people read lives in one file: **`src/content/wedding.ts`**.
Each string has an English and a Hindi version (`{ en, hi }`). In headings, `*word*` becomes the italic accent and `\n` a line break.

| What | Where in `wedding.ts` |
|---|---|
| Couple, honorifics, lineage | `COUPLE` |
| Ceremonies, dates, times, venue, photos | `EVENTS` |
| Venue name, address, map search | `VENUE` |
| प्रेषक, विनीत, दर्शनाभिलाषी, बुआ-फूफा जी, व्यवस्थापक | `FAMILY` |
| बाल मनुहार | `BAL_MANUHAR` |
| Phone numbers in the footer | `CONTACTS` |
| **WhatsApp number that receives RSVPs** | `RSVP_WHATSAPP` (currently 94066-44404) |
| Gallery photos and captions | `GALLERY` |

The countdown automatically targets the next upcoming ceremony and switches to “Just married” afterwards.
“Add to calendar” downloads an `.ics` file with all four ceremonies.

## How the RSVP works

There is no database. Submitting the form opens WhatsApp with a pre-written message (name, phone, guests, ceremonies, blessings) addressed to `RSVP_WHATSAPP`, so replies land straight in the family's chat.

## Structure

```
src/
  app/                 layout (fonts, metadata), page (section order), globals.css (Tailwind tokens + components)
  content/wedding.ts   all copy, dates and data
  lib/                 gsap setup, Lenis scroll helpers, language store, arch geometry, petal canvas
  components/
    chrome/            preloader doors, nav + menu + language toggle, mobile action bar, cursor, reveals, theme controller
    sections/          hero (palace-window fly-through), invitation, couple, countdown, celebrations,
                       gallery, venue, blessings, bal manuhar, RSVP, footer
    ornaments/         generative SVG: mandala, lanterns, diyas, florals, kalash, dividers, badges
```

## Share preview (WhatsApp, etc.)

The image people see when the link is shared is `src/app/opengraph-image.jpg` (1200×630).
It is designed as a page at **`/og-card`**, which only exists under `npm run dev`. To update it after changing names or dates:

1. `npm run dev`, then open `http://localhost:3000/og-card` and check it looks right.
2. Screenshot the card at 1200×630 and save it as `src/app/opengraph-image.jpg`. Keep it under ~300 KB, because WhatsApp sometimes drops larger previews.

WhatsApp caches previews per link. After changing the image, share the link with something new on the end (e.g. `?v=2`) to see the update.

## Photos

Photos are in `public/images/`; sources and licences are in `public/images/CREDITS.md`.
Four photos are CC BY-SA 4.0 and are credited in the site footer. Keep that credit if you keep those photos.
To use your own photos, replace the files with the same names (portrait 4:5 works best for the ceremony cards).
