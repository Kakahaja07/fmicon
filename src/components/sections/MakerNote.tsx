import { story } from "~/content/site";
import { Avatar } from "~/components/ui/Avatar";
import { Container } from "~/components/ui/Container";
import { Reveal } from "~/components/ui/Reveal";
import s from "./MakerNote.module.css";

/** A short, personal note from the maker, as its own calm section near the end. */
export function MakerNote() {
  const [maker] = story.makers;
  return (
    <section id="story" className={s.section} aria-labelledby="story-title">
      <Container>
        <Reveal className={s.card}>
          <div className={s.who}>
            <Avatar initial={maker.initial} emoji={maker.emoji} image={maker.image} colors={maker.colors} size="lg" />
            <div>
              <b className={s.sign}>{maker.name}</b>
              <small className={s.role}>{maker.role}</small>
            </div>
          </div>
          <div className={s.words}>
            <h2 id="story-title" className={s.title}>
              {story.title}
            </h2>
            {story.paragraphs.map((p) => (
              <p key={p} className={s.p}>
                {p}
              </p>
            ))}
            <p className={s.ps}>{story.ps}</p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
