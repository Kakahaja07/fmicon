import { closingCta } from "~/content/site";
import { ArrowRightIcon } from "~/components/icons/Icons";
import { AppIcon } from "~/components/ui/AppIcon";
import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { Reveal } from "~/components/ui/Reveal";
import { GithubLogo } from "~/components/ui/FrameworkLogo";
import s from "./ClosingCta.module.css";

export function ClosingCta() {
  return (
    <Container className={s.outer}>
      <Reveal>
        <section className={s.cta} aria-labelledby="cta-title">
          <AppIcon size={64} />
          <div>
            <h2 id="cta-title" className={s.title}>
              {closingCta.title}
            </h2>
            <p className={s.text}>{closingCta.text}</p>
          </div>
          <div className={s.actions}>
            <Button href={closingCta.primary.href} size="lg" iconRight={ArrowRightIcon}>
              {closingCta.primary.label}
            </Button>
            <Button href={closingCta.secondary.href} target="_blank" rel="noreferrer" variant="ghost" size="lg" icon={GithubLogo}>
              {closingCta.secondary.label}
            </Button>
          </div>
        </section>
      </Reveal>
    </Container>
  );
}
