import { features } from "~/content/site";
import { ArrowRightIcon } from "~/components/icons/Icons";
import { BentoCard, BentoGrid } from "~/components/ui/BentoCard";
import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { FeatureTile, FeatureTileGrid } from "~/components/ui/FeatureTile";
import { Reveal } from "~/components/ui/Reveal";
import { SectionHeading } from "~/components/ui/SectionHeading";
import { ChatArt, ToolDots } from "~/components/art/ChatArt";
import { FormatsArt } from "~/components/art/FormatsArt";
import { RecolorArt } from "~/components/art/RecolorArt";
import { SearchArt } from "~/components/art/SearchArt";
import { StylesArt } from "~/components/art/StylesArt";
import { TerminalArt } from "~/components/art/TerminalArt";
import s from "./Features.module.css";

export function Features() {
  const { cards } = features;

  return (
    <section id="features" className={s.section} aria-labelledby="features-title">
      <Container>
        <Reveal>
          <SectionHeading id="features-title" title={features.title}>
            {features.intro.text}{" "}
            <a className={s.link} href={features.intro.link.href}>
              {features.intro.link.label}
            </a>
          </SectionHeading>
        </Reveal>

        <div className={s.bento}>
          <BentoGrid>
            <Reveal>
              <BentoCard
                title={cards.styles.title}
                description={cards.styles.description}
                art={<StylesArt />}
              />
            </Reveal>
            <Reveal delay={80}>
              <BentoCard
                title={cards.ai.title}
                description={<ToolDots label={cards.ai.description} />}
                art={<ChatArt me={cards.ai.chat.me} ai={cards.ai.chat.ai} />}
                align="bottom"
              />
            </Reveal>
            <Reveal>
              <BentoCard title={cards.recolor.title} description={cards.recolor.description} art={<RecolorArt />} tone="dark" align="bottom" />
            </Reveal>
            <Reveal delay={80}>
              <BentoCard title={cards.search.title} description={cards.search.description} art={<SearchArt query={cards.search.query} />} align="bottom" />
            </Reveal>
            <Reveal>
              <BentoCard title={cards.export.title} description={cards.export.description} art={<FormatsArt />} align="bottom" />
            </Reveal>
            <Reveal delay={80}>
              <BentoCard title={cards.native.title} description={cards.native.description} art={<TerminalArt />} tone="dark" align="bottom" />
            </Reveal>
          </BentoGrid>
        </div>

        <div className={s.tiles}>
          <FeatureTileGrid>
            {features.tiles.map((tile) => (
              <FeatureTile key={tile.title} {...tile} />
            ))}
          </FeatureTileGrid>
        </div>

        <div className={s.more}>
          <Button href={features.more.href} variant="ghost" iconRight={ArrowRightIcon}>
            {features.more.label}
          </Button>
        </div>
      </Container>
    </section>
  );
}
