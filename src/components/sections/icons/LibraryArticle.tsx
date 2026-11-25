import { Link } from "@tanstack/react-router";
import { freeIconsMeta } from "~/content/freeIcons.meta";
import { libraryArticle as copy, styleKeywords } from "~/content/libraryArticle";
import { styleNotes } from "~/content/iconArticle";
import { AccordionItem } from "~/components/ui/Accordion";
import { SvgIcon } from "~/components/ui/SvgIcon";
import { iconPath, stylePath } from "~/lib/iconSeo";
import { styleLabels, type IconStyle } from "~/lib/svg";
import { useIconStyle } from "~/hooks/useIconStyle";
import keywordPlan from "../../../../scripts/data/icon-keywords.json";
import s from "./LibraryArticle.module.css";
import { titleCase } from "~/lib/titleCase";

// The phrase people search for each curated icon, e.g. "hourglass icon" for "timer"
const plan = keywordPlan as unknown as Record<string, [string, string[], string]>;
const popularIcons = Object.keys(plan)
  .filter((slug) => slug !== "_note")
  .slice(0, 30)
  .map((slug) => ({ slug, label: plan[slug][0].charAt(0).toUpperCase() + plan[slug][0].slice(1) }));

/**
 * Written content under the icon grid on /icons and /icons/<style>: what the library is,
 * the styles, popular icons and a FAQ. Prerendered, full of internal links.
 */
export function LibraryArticle({ style }: { style: IconStyle }) {
  // Each name gets its glyph in the page's style (the same cached file the grid uses)
  const data = useIconStyle(style);
  const bodies = new Map(data.status === "ready" ? data.icons.map((i) => [i.slug, i.body]) : []);
  const onStylePage = style !== "linear";
  const label = styleLabels[style];
  const head = onStylePage ? copy.style(style, label) : copy.library;
  const faq = copy.faq(onStylePage ? { id: style, label } : undefined);
  const popular = popularIcons.map((p) => ({ ...p, body: bodies.get(p.slug) }));

  return (
    <article className={s.article}>
      <section className={s.section}>
        <h2 className={s.lead}>{titleCase(head.title)}</h2>
        {head.intro.map((p) => (
          <p key={p}>{p}</p>
        ))}
        {onStylePage && (
          <p>
            {styleNotes[style].summary} Best for {styleNotes[style].bestFor}.
          </p>
        )}
      </section>

      <section className={s.section}>
        <h2>{titleCase(copy.styles.title)}</h2>
        <p>{copy.styles.text}</p>
        <div className={s.styles}>
          {(freeIconsMeta.styles as readonly IconStyle[]).map((st) => (
            <Link key={st} to={stylePath(st)} className={s.style} data-current={st === style || undefined}>
              <SvgIcon body={freeIconsMeta.samples[st]} size={26} />
              <span>
                <b>{styleLabels[st]} icons</b>
                {styleKeywords[st].short}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className={s.section}>
        <h2>{titleCase(copy.popular.title)}</h2>
        <p>{copy.popular.text}</p>
        <ul className={s.popular}>
          {popular.map((p) => (
            <li key={p.slug}>
              <a href={iconPath(style, p.slug)}>
                <span className={s.popularIcon}>{p.body && <SvgIcon body={p.body} size={18} />}</span>
                {p.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className={s.section}>
        <h2>{titleCase(copy.faqTitle)}</h2>
        <div>
          {faq.map((f, i) => (
            <AccordionItem key={f.q} question={f.q} defaultOpen={i === 0}>
              {f.a}
            </AccordionItem>
          ))}
        </div>
      </section>
    </article>
  );
}
