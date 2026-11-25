import type { ComponentType, MouseEvent } from "react";
import { Link } from "@tanstack/react-router";
import { freeIconsMeta } from "~/content/freeIcons.meta";
import { iconArticle as copy, styleNotes } from "~/content/iconArticle";
import { openSource } from "~/content/site";
import { GithubLogo } from "~/components/ui/FrameworkLogo";
import {
  ArrowRightIcon,
  CodeIcon,
  InfoCircleIcon,
  LampChargeIcon,
  LayerIcon,
  LinkIcon,
  MessageQuestionIcon,
  TaskSquareIcon,
  TextalignLeftIcon,
  TickCircleIcon,
} from "~/components/icons/Icons";
import { AccordionItem } from "~/components/ui/Accordion";
import { SvgIcon } from "~/components/ui/SvgIcon";
import { useActiveSection } from "~/hooks/useActiveSection";
import type { IconArticle as Article } from "~/lib/iconArticle";
import { iconPath, labelForCategory, stylePath } from "~/lib/iconSeo";
import { componentName, humanName, strokeStyles, styleLabels, type FreeIcon, type IconStyle } from "~/lib/svg";
import s from "./IconArticle.module.css";
import { titleCase } from "~/lib/titleCase";

type IconArticleProps = {
  icon: FreeIcon;
  style: IconStyle;
  article: Article;
  /** Icons of the current style that this one links to (pairs) */
  pairs: FreeIcon[];
  onNavigate: (id: string) => void;
};

type SectionId = keyof typeof copy.tocLabels;
const sectionIcons: Record<SectionId, ComponentType<{ size?: number }>> = {
  about: InfoCircleIcon,
  uses: TaskSquareIcon,
  style: LayerIcon,
  howTo: CodeIcon,
  tips: LampChargeIcon,
  pairs: LinkIcon,
  faq: MessageQuestionIcon,
};
const ids: SectionId[] = ["about", "uses", "style", "howTo", "tips", "pairs", "faq"];
const anchor = (id: SectionId) => `icon-${id}`;

/**
 * The written part of an icon page: what the icon means, when to use it, its style,
 * how to use it, tips, related icons and a FAQ, with a sticky table of contents.
 * Rendered into the prerendered HTML so search engines can read it.
 */
export function IconArticle({ icon, style, article, pairs, onNavigate }: IconArticleProps) {
  const active = useActiveSection(ids.map(anchor));
  const name = humanName(icon.name).toLowerCase();
  const Name = humanName(icon.name);
  const label = styleLabels[style];
  const category = labelForCategory(icon.category);
  const note = styleNotes[style];
  const others = (freeIconsMeta.styles as readonly IconStyle[]).filter((st) => st !== style);
  const faq = [...article.faq, copy.licence(name, freeIconsMeta.total), copy.formats(name)];

  // Same-page links stay inside the tool, like the grid
  const open = (e: MouseEvent, id: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    onNavigate(id);
  };

  const heading = (id: SectionId, text: string) => {
    const Icon = sectionIcons[id];
    return (
      <h2 className={s.h2}>
        <span className={s.h2Icon}>
          <Icon size={18} />
        </span>
        {titleCase(text)}
      </h2>
    );
  };

  return (
    <div className={s.wrap}>
      <div className={s.body}>
        <section id={anchor("about")} className={s.section}>
          {heading("about", copy.sections.about(name))}
          <p className={s.lead}>{article.intro}</p>
          <p>{article.meaning}</p>
        </section>

        <section id={anchor("uses")} className={s.section}>
          {heading("uses", copy.sections.uses(article.primary))}
          <ul className={s.checks}>
            {article.uses.map((use) => {
              const [place, ...rest] = use.split(": ");
              return (
                <li key={use}>
                  <TickCircleIcon size={18} />
                  <span>{rest.length ? (<><b>{place}:</b> {rest.join(": ")}</>) : use}</span>
                </li>
              );
            })}
          </ul>
        </section>

        <section id={anchor("style")} className={s.section}>
          {heading("style", copy.sections.style(name, label))}
          <p>{note.summary}</p>
          <p className={s.bestFor}>
            <b>{copy.bestFor}:</b> {note.bestFor}.
          </p>
          <p>
            {copy.otherStyles}{" "}
            {others.map((st, i) => (
              <span key={st}>
                <Link to="/icons/$style/$slug" params={{ style: st, slug: icon.slug }} className={s.inline}>
                  {styleLabels[st].toLowerCase()}
                </Link>
                {i < others.length - 2 ? ", " : i === others.length - 2 ? " and " : "."}
              </span>
            ))}{" "}
            See every icon in this look on the{" "}
            <Link to={stylePath(style)} className={s.inline}>
              free {label.toLowerCase()} icons
            </Link>{" "}
            page.
          </p>
        </section>

        <section id={anchor("howTo")} className={s.section}>
          {heading("howTo", copy.sections.howTo(name))}
          <ol className={s.steps}>
            <li>
              <b>Customise it.</b>{" "}
              {strokeStyles.has(style)
                ? "Pick a stroke weight, size and colour on the left. Thin (1 px) looks best at large sizes, Regular (1.5 px) is the default."
                : `${label} is a filled style, so pick a size${style === "glass" ? "" : " and colour"} on the left; stroke weight doesn't apply.`}
            </li>
            <li>
              <b>Copy or download.</b> Copy the SVG, or download SVG, PNG or WebP at any size from 16 to 512 px.
            </li>
            <li>
              <b>Drop it into code.</b> Choose React, React Native, Vue, Svelte, Angular or Flutter above and copy the ready-made{" "}
              <code>{componentName(icon.name)}</code> component.
            </li>
            <li>
              <b>Label it.</b> If the icon is the only thing in a button, give it a name for screen readers:{" "}
              <code>aria-label="{article.aria}"</code>. If text sits next to it, use <code>aria-hidden="true"</code> instead.
            </li>
          </ol>
        </section>

        <section id={anchor("tips")} className={s.section}>
          {heading("tips", copy.sections.tips(name))}
          <ul className={s.tips}>
            {article.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>

        <section id={anchor("pairs")} className={s.section}>
          {heading("pairs", copy.sections.pairs(name))}
          <div className={s.pairs}>
            {pairs.map((p) => (
              <a key={p.id} href={iconPath(style, p.slug)} className={s.pair} onClick={(e) => open(e, p.id)}>
                <span className={s.pairIcon}>
                  <SvgIcon body={p.body} size={20} />
                </span>
                <span className={s.pairName}>{humanName(p.name)} icon</span>
                <ArrowRightIcon size={16} />
              </a>
            ))}
          </div>
          <Link to={stylePath(style)} search={{ cat: icon.category }} className={s.inline}>
            {copy.browseCategory(category.toLowerCase())}
          </Link>
        </section>

        <section id={anchor("faq")} className={s.section}>
          {heading("faq", copy.sections.faq(Name))}
          <div className={s.faq}>
            {faq.map((f, i) => (
              <AccordionItem key={f.q} question={f.q} defaultOpen={i === 0}>
                {f.a}
              </AccordionItem>
            ))}
          </div>
        </section>
      </div>

      {/* Table of contents */}
      <aside className={s.aside}>
        <nav className={s.toc} aria-label={copy.toc}>
          <p className={s.tocTitle}>
            <TextalignLeftIcon size={16} />
            {copy.toc}
          </p>
          <ol>
            {ids.map((id) => (
              <li key={id}>
                <a href={`#${anchor(id)}`} data-active={active === anchor(id) || undefined}>
                  {copy.tocLabels[id]}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className={s.tags}>
          <p className={s.tocTitle}>{copy.alsoKnown}</p>
          <ul>
            {[article.primary, ...article.keywords].map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
        </div>

        <a href={openSource.repo} target="_blank" rel="noreferrer" className={s.promo}>
          <b>{copy.promo.title(freeIconsMeta.total)}</b>
          <span>{copy.promo.text(freeIconsMeta.total)}</span>
          <span className={s.promoCta}>
            <GithubLogo size={14} />
            {copy.promo.cta}
          </span>
        </a>
      </aside>
    </div>
  );
}
