import { Link } from "@tanstack/react-router";
import { freeIconsMeta } from "~/content/freeIcons.meta";
import { libraryArticle as copy, styleKeywords } from "~/content/libraryArticle";
import { styleNotes } from "~/content/iconArticle";
import { ArrowRightIcon } from "~/components/icons/Icons";
import { AccordionItem } from "~/components/ui/Accordion";
import { SvgIcon } from "~/components/ui/SvgIcon";
import { iconPath, stylePath } from "~/lib/iconSeo";
import { styleLabels, type IconStyle } from "~/lib/svg";
import keywordPlan from "../../../../scripts/data/icon-keywords.json";
import s from "./LibraryArticle.module.css";

// The phrase people search for each curated icon, e.g. "hourglass icon" for "timer"
const plan = keywordPlan as unknown as Record<string, [string, string[], string]>;
const popular = Object.keys(plan)
  .filter((slug) => slug !== "_note")
  .slice(0, 30)
  .map((slug) => ({ slug, label: plan[slug][0].charAt(0).toUpperCase() + plan[slug][0].slice(1) }));

const categories = [...freeIconsMeta.categories].sort((a, b) => b.count - a.count);

/**
 * Written content under the icon grid on /icons and /icons/<style>: what the library is,
 * the styles, categories, popular icons, how to use them and a FAQ. Prerendered, full of internal links.
 */
export function LibraryArticle({ style }: { style: IconStyle }) {
  const onStylePage = style !== "linear";
  const label = styleLabels[style];
  const head = onStylePage ? copy.style(style, label) : copy.library;
  const faq = copy.faq(onStylePage ? { id: style, label } : undefined);

  return (
    <article className={s.article}>
      <section className={s.section}>
        <h2 className={s.lead}>{head.title}</h2>
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
        <h2>{copy.styles.title}</h2>
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
        <h2>{copy.popular.title}</h2>
        <p>{copy.popular.text}</p>
        <ul className={s.links}>
          {popular.map((p) => (
            <li key={p.slug}>
              <a href={iconPath(style, p.slug)}>{p.label}</a>
            </li>
          ))}
        </ul>
      </section>

      <section className={s.section}>
        <h2>{copy.categories.title}</h2>
        <ul className={s.chips}>
          {categories.map((c) => (
            <li key={c.slug}>
              <Link to={stylePath(style)} search={{ cat: c.slug }}>
                {c.label}
                <span>{c.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={s.section}>
        <h2>{copy.howTo.title}</h2>
        <ol className={s.steps}>
          {copy.howTo.steps.map((step) => (
            <li key={step.title}>
              <b>{step.title}</b>
              <span>{step.text}</span>
              {"link" in step && step.link && (
                <Link to={step.link.href} className={s.more}>
                  {step.link.label}
                  <ArrowRightIcon size={14} />
                </Link>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className={s.section}>
        <h2>{copy.faqTitle}</h2>
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
