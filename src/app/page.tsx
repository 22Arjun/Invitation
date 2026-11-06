import { Cursor } from "@/components/chrome/Cursor";
import { MobileDock } from "@/components/chrome/MobileDock";
import { Nav } from "@/components/chrome/Nav";
import { Preloader } from "@/components/chrome/Preloader";
import { Reveals } from "@/components/chrome/Reveals";
import { ScrollProgress } from "@/components/chrome/ScrollProgress";
import { SmoothScroll } from "@/components/chrome/SmoothScroll";
import { ThemeController } from "@/components/chrome/ThemeController";
import { ArchDefs } from "@/components/sections/ArchOutline";
import { BalManuhar } from "@/components/sections/BalManuhar";
import { Blessings } from "@/components/sections/Blessings";
import { Celebrations } from "@/components/sections/Celebrations";
import { Countdown } from "@/components/sections/Countdown";
import { Couple } from "@/components/sections/Couple";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Invitation } from "@/components/sections/Invitation";
import { Marquee } from "@/components/sections/Marquee";
import { Rsvp } from "@/components/sections/Rsvp";
import { Shringaar } from "@/components/sections/Shringaar";
import { Venue } from "@/components/sections/Venue";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#invitation">
        Skip to content
      </a>
      <ArchDefs />
      <SmoothScroll />
      <Preloader />
      <Nav />
      <main id="main">
        <Hero />
        <Marquee />
        <Invitation />
        <Couple />
        <Countdown />
        <Celebrations />
        <Shringaar />
        <Venue />
        <Blessings />
        <BalManuhar />
        <Rsvp />
      </main>
      <Footer />
      {/* Decorative fixed layers sit after the content so they never force it onto extra GPU layers. */}
      <MobileDock />
      <ScrollProgress />
      <Cursor />
      {/* Created last so every pinned section above is measured first. */}
      <Reveals />
      <ThemeController />
    </>
  );
}
