import { createFileRoute } from "@tanstack/react-router";
import { brand } from "~/content/site";
import { Faq } from "~/components/sections/Faq";
import { Features } from "~/components/sections/Features";
import { Hero } from "~/components/sections/Hero";
import { MakerNote } from "~/components/sections/MakerNote";
import { OpenSource } from "~/components/sections/OpenSource";
import { Sampler } from "~/components/sections/Sampler";

export const Route = createFileRoute("/_site/")({
  // Each page sets its own canonical URL.
  head: () => ({ links: [{ rel: "canonical", href: brand.siteUrl }] }),
  component: HomePage,
});

/** The home page only arranges sections; each section owns its own markup and styles. */
function HomePage() {
  return (
    <main id="top">
      <Hero />
      <Features />
      <Sampler />
      <OpenSource />
      <MakerNote />
      <Faq />
    </main>
  );
}
