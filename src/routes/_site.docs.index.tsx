import { createFileRoute, Link } from "@tanstack/react-router";
import { brand } from "~/content/site";
import { docPages, docsIntro } from "~/content/docs";
import { DocsLayout } from "~/components/docs/DocsLayout";
import { Inline } from "~/components/docs/DocContent";
import { FrameworkLogo } from "~/components/ui/FrameworkLogo";
import { pageHead } from "~/lib/iconSeo";
import s from "~/components/docs/DocsIntro.module.css";
import { titleCase } from "~/lib/titleCase";

export const Route = createFileRoute("/_site/docs/")({
  head: () =>
    pageHead({
      title: `${brand.name} Docs: Free Icons for React, Vue, Svelte & More`,
      description: "Install FM Icons for React, Vue, Svelte, React Native or vanilla JS, or use the raw SVGs from the CDN. Props, styles, accessibility and more.",
      path: "/docs",
      image: "docs",
    }),
  component: DocsIntro,
});

function DocsIntro() {
  return (
    <DocsLayout toc={[{ id: "intro", title: docsIntro.title }, { id: "integrations", title: docsIntro.choose }]}>
      <article className={s.article}>
        <section id="intro" className={s.section}>
          <h1 className={s.h1}>{titleCase(docsIntro.title)}</h1>
          {docsIntro.text.map((t) => (
            <p key={t}>
              <Inline text={t} />
            </p>
          ))}
          {/* Same image as the GitHub README (npm run readme) */}
          <figure className={s.showcase}>
            <img src="/images/showcase.png" alt="Ten FM Icons shown in the linear, bold, duotone and glass styles" width={900} height={330} loading="lazy" />
          </figure>
        </section>

        <section id="integrations" className={s.section}>
          <h2 className={s.h2}>{titleCase(docsIntro.choose)}</h2>
          <div className={s.grid}>
            {docPages.map((p) => (
              <Link key={p.id} to="/docs/$framework" params={{ framework: p.id }} className={s.card}>
                <FrameworkLogo framework={p.logo} size={20} />
                {p.label}
              </Link>
            ))}
          </div>
        </section>
      </article>
    </DocsLayout>
  );
}
