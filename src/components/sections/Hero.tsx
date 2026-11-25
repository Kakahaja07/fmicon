import { hero } from "~/content/site";
import { ArrowRightIcon } from "~/components/icons/Icons";
import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { GithubLogo, NpmLogo } from "~/components/ui/FrameworkLogo";
import { AppWindow } from "./AppWindow";
import { HeroSearch } from "./HeroSearch";
import { IconField } from "./IconField";
import { StatsBand } from "./StatsBand";
import s from "./Hero.module.css";
import { titleCase } from "~/lib/titleCase";

/**
 * Icon-platform hero: a quiet wall of real icons behind, a search bar as the main action,
 * browse / GitHub pair, then the app itself on a clean grid backdrop.
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
          {titleCase(hero.title)}
        </h1>
        <p className={s.sub}>{hero.sub}</p>

        <div className={s.search}>
          <HeroSearch />
        </div>

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
