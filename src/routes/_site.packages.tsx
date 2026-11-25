import { createFileRoute, Link } from "@tanstack/react-router";
import { brand } from "~/content/site";
import { npmUrl, packagesPage, sourceUrl, VERSION, type PackageCard } from "~/content/packages";
import { Container } from "~/components/ui/Container";
import { FrameworkLogo, GithubLogo, NpmLogo } from "~/components/ui/FrameworkLogo";
import { pageHead } from "~/lib/iconSeo";
import { titleCase } from "~/lib/titleCase";
import s from "~/components/sections/Packages.module.css";

export const Route = createFileRoute("/_site/packages")({
  head: () =>
    pageHead({
      title: `Icon Packages for React, Vue, Svelte & React Native | ${brand.name}`,
      description: "Every fmicon package in one place: fmicon, fmicon-react, fmicon-react-native, fmicon-vue, fmicon-svelte and fmicon-svg, plus the CDN. Free, MIT licence.",
      path: "/packages",
      image: "docs",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${brand.name} packages`,
          itemListElement: packagesPage.sections
            .flatMap((sec) => sec.items)
            .map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, url: `${brand.siteUrl}/docs/${item.doc}` })),
        },
      ],
    }),
  component: PackagesPage,
});

function PackagesPage() {
  return (
    <main className={s.page}>
      <Container>
        <header className={s.intro}>
          <h1 className={s.h1}>{packagesPage.title}</h1>
          <p className={s.sub}>{packagesPage.sub}</p>
        </header>

        {packagesPage.sections.map((section) => (
          <section key={section.title} className={s.section} aria-labelledby={`pk-${section.title}`}>
            <h2 id={`pk-${section.title}`} className={s.h2}>
              {titleCase(section.title)}
            </h2>
            <div className={s.grid}>
              {section.items.map((item) => (
                <Card key={item.name} item={item} />
              ))}
            </div>
          </section>
        ))}
      </Container>
    </main>
  );
}

function Card({ item }: { item: PackageCard }) {
  return (
    <article className={s.card}>
      <div className={s.top}>
        <FrameworkLogo framework={item.logo} size={28} />
        <span className={s.badge}>{item.badge ?? `v${VERSION}`}</span>
      </div>
      <h3 className={s.name}>{item.name}</h3>
      <p className={s.desc}>{item.description}</p>
      {item.install && <code className={s.install}>{item.install}</code>}
      <div className={s.actions}>
        {/* The guide is the one place that explains how to use it */}
        <Link to="/docs/$framework" params={{ framework: item.doc }} className={s.guide}>
          Guide
        </Link>
        {item.source && (
          <a className={s.action} href={sourceUrl(item.source)} target="_blank" rel="noreferrer">
            <GithubLogo size={13} />
            Source
          </a>
        )}
        {item.npm && (
          <a className={s.action} href={npmUrl(item.name)} target="_blank" rel="noreferrer">
            <NpmLogo size={13} />
            npm
          </a>
        )}
        {item.extra && (
          <a className={s.action} href={item.extra.href} target="_blank" rel="noreferrer">
            {item.extra.label}
          </a>
        )}
      </div>
    </article>
  );
}
