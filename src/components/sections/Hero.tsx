import { Link } from "@tanstack/react-router";
import { hero } from "~/content/site";
import { ArrowRightIcon } from "~/components/icons/Icons";
import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { GithubLogo, NpmLogo } from "~/components/ui/FrameworkLogo";
import { AppTile } from "~/components/ui/AppTile";
import { StarBoldIcon } from "~/components/icons/Icons";
import { formatStars, useGithubStars } from "~/hooks/useGithubStars";
import { AppWindow } from "./AppWindow";
import { IconField } from "./IconField";
import { StatsBand } from "./StatsBand";
import s from "./Hero.module.css";

/**
 * Icon-platform hero: a quiet wall of real icons behind, the headline, the browse / GitHub pair,
 * then the app itself on a clean grid backdrop.
 */
export function Hero() {
  const stars = useGithubStars(hero.secondary.href);
  return (
    <section className={s.hero} aria-labelledby="hero-title">
      <IconField />

      <Container className={s.inner}>
        <Link to={hero.announce.href} className={s.announce}>
          <span className={s.announceBadge}>{hero.announce.badge}</span>
          {/* The AI apps it works in, as a small overlapping stack */}
          <span className={s.announceLogos} aria-hidden="true">
            {(["claude", "vscode", "codex"] as const).map((app) => (
              <AppTile key={app} app={app} size={20} />
            ))}
          </span>
          <span className={s.announceLong}>{hero.announce.label}</span>
          <span className={s.announceShort}>{hero.announce.short}</span>
          <ArrowRightIcon size={14} className={s.announceArrow} />
        </Link>

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
          {/* GitHub logo, then the live star count */}
          <Button
            href={hero.secondary.href}
            target="_blank"
            rel="noreferrer"
            variant="ghost"
            size="lg"
            icon={GithubLogo}
            className={s.github}
            aria-label={`Star fmicon on GitHub (${stars} ${stars === 1 ? "star" : "stars"})`}
            badge={
              <span className={s.stars}>
                <StarBoldIcon size={13} color="#ffc53d" />
                {formatStars(stars)}
              </span>
            }
          >
            {null}
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
