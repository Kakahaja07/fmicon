import { hero } from "~/content/site";
import { ArrowRightIcon } from "~/components/icons/Icons";
import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { GithubLogo, NpmLogo } from "~/components/ui/FrameworkLogo";
import { AppWindow } from "./AppWindow";
import { IconField } from "./IconField";
import { StatsBand } from "./StatsBand";
import s from "./Hero.module.css";

/**
 * Icon-platform hero: a quiet wall of real icons behind, the headline, the browse / GitHub pair,
 * then the app itself on a clean grid backdrop.
 */
export function Hero() {
  return (
    <section className={s.hero} aria-labelledby="hero-title">
      <IconField />

      <Container className={s.inner}>
        <a href={hero.announce.href} target="_blank" rel="noreferrer" className={s.announce}>
          <span className={s.announceBadge}>{hero.announce.badge}</span>
          {hero.announce.label}
          <ArrowRightIcon size={14} />
        </a>

        <h1 id="hero-title" className={s.title}>
          {hero.titleDisplay}
        </h1>
        <p className={s.sub}>
          {hero.sub.split(hero.subHighlight)[0]}
          <span className={s.scribbled}>
            {hero.subHighlight}
            {/* Hand-drawn pencil underline, drawn in once */}
            <svg className={s.pencil} viewBox="0 0 220 14" preserveAspectRatio="none" aria-hidden="true">
              <path d="M2 9.5C20 6.5 34 11 52 8.2S86 4.6 104 8.6 140 11.4 160 7.6 196 5.2 218 8.8" />
            </svg>
          </span>
          {hero.sub.split(hero.subHighlight)[1]}
        </p>

        <div className={s.actions}>
          <Button href={hero.primary.href} size="lg" iconRight={ArrowRightIcon}>
            {hero.primary.label}
          </Button>
          <Button href={hero.secondary.href} target="_blank" rel="noreferrer" variant="ghost" size="lg" icon={GithubLogo}>
            {hero.secondary.label}
          </Button>
        </div>

        <p className={s.meta}>
          {hero.meta.map((item, i) => (
            <span key={item}>
              {item}
              {i < hero.meta.length - 1 && <span aria-hidden="true"> · </span>}
            </span>
          ))}
          <code className={s.install}>
            <NpmLogo size={14} />
            {hero.install}
          </code>
        </p>
      </Container>

      <Container className={s.showcase}>
        {/* The app on a clean grid backdrop, lit softly from above in the brand colour */}
        <div className={s.stage}>
          <AppWindow />
        </div>
        <StatsBand />
      </Container>
    </section>
  );
}
