import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { brand } from "~/content/site";
import { docPages } from "~/content/docs";
import { ArrowLeftIcon, ArrowRightIcon } from "~/components/icons/Icons";
import { DocActions } from "~/components/docs/DocActions";
import { DocContent } from "~/components/docs/DocContent";
import { DocsLayout } from "~/components/docs/DocsLayout";
import { pageHead } from "~/lib/iconSeo";
import s from "~/components/docs/DocsPager.module.css";

/** /docs/<framework>: one long guide per framework, from install to troubleshooting. */
export const Route = createFileRoute("/_site/docs/$framework")({
  beforeLoad: ({ params }) => {
    if (!docPages.some((p) => p.id === params.framework)) throw notFound();
  },
  head: ({ params }) => {
    const page = docPages.find((p) => p.id === params.framework);
    if (!page) return {};
    return pageHead({
      title: page.install
        ? `${page.label} Icons: Free Icon Package & Setup Guide - ${brand.name}`
        : `${page.label} Icons: Free Icons & Setup Guide - ${brand.name}`,
      description: page.description.replace(/`/g, ""),
      path: `/docs/${page.id}`,
      image: "docs",
    });
  },
  component: FrameworkDocs,
});

function FrameworkDocs() {
  const { framework } = Route.useParams();
  const index = docPages.findIndex((p) => p.id === framework);
  const page = docPages[index];
  if (!page) return null;
  const prev = docPages[index - 1];
  const next = docPages[index + 1];

  return (
    <DocsLayout current={page.id} toc={page.sections.map((sec) => ({ id: sec.id, title: sec.title }))}>
      <DocContent
        key={page.id}
        page={page}
        actions={
          <DocActions
            page={page}
            prev={prev ? { to: `/docs/${prev.id}`, label: prev.label } : { to: "/docs", label: "Introduction" }}
            next={next ? { to: `/docs/${next.id}`, label: next.label } : undefined}
          />
        }
        footer={
          <nav className={s.pager} aria-label="More docs">
            {prev ? (
              <Link to="/docs/$framework" params={{ framework: prev.id }} className={s.prev}>
                <span>Previous</span>
                <b>
                  <ArrowLeftIcon size={16} />
                  {prev.label}
                </b>
              </Link>
            ) : (
              <Link to="/docs" className={s.prev}>
                <span>Previous</span>
                <b>
                  <ArrowLeftIcon size={16} />
                  Introduction
                </b>
              </Link>
            )}
            {next && (
              <Link to="/docs/$framework" params={{ framework: next.id }} className={s.next}>
                <span>Next</span>
                <b>
                  {next.label}
                  <ArrowRightIcon size={16} />
                </b>
              </Link>
            )}
          </nav>
        }
      />
    </DocsLayout>
  );
}
