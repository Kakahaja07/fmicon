import { openSource, story } from "~/content/site";
import { Avatar } from "~/components/ui/Avatar";
import { Container } from "~/components/ui/Container";
import { Reveal } from "~/components/ui/Reveal";
import s from "./MakerNote.module.css";
import { titleCase } from "~/lib/titleCase";

/** A short, personal note from the maker, as its own calm section near the end. */
export function MakerNote() {
  const [maker] = story.makers;
  return (
    <section id="story" className={s.section} aria-labelledby="story-title">
      <Container>
        <Reveal className={s.card}>
          {/* The note itself on the left; the maker signs it in the bottom-right corner */}
          <h2 id="story-title" className={s.title}>
            {titleCase(story.title)}
          </h2>
          {story.paragraphs.map((p) => (
            <p key={p} className={s.p}>
              {p}
            </p>
          ))}
          <div className={s.foot}>
            {/* Hand-written P.S.: a green pencil note that links to a new GitHub issue */}
            <a className={s.ps} href={`${openSource.repo}/issues/new`} target="_blank" rel="noreferrer">
              <span className={s.psText}>
                {story.ps}
                <svg className={s.psLine} viewBox="0 0 300 10" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M2 6.5C40 4 70 8 110 5.6S180 3.4 220 6.2 270 7.4 298 4.8" />
                </svg>
              </span>
              <svg className={s.psArrow} viewBox="0 0 26 14" aria-hidden="true">
                <path d="M2 8.4C8 6.4 14 7.8 22 6.6" />
                <path d="M17.4 2.6C19.6 4.2 21.2 5.4 22.6 6.6 20.8 7.8 19.2 9.4 17.6 11.4" />
              </svg>
            </a>
            <div className={s.who}>
              <div className={s.whoText}>
                <b className={s.sign}>{maker.name}</b>
                <small className={s.role}>{maker.role}</small>
              </div>
              <Avatar initial={maker.initial} emoji={maker.emoji} image={maker.image} colors={maker.colors} size="lg" />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
