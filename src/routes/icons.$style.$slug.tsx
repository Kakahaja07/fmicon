import { createFileRoute, notFound } from "@tanstack/react-router";
import { loadIcons } from "~/hooks/useIconStyle";
import { IconsTool } from "~/components/sections/icons/IconsTool";
import { iconHead, isStyle, validateToolSearch } from "~/lib/iconSeo";
import { loadArticle, loadVariants } from "~/lib/iconArticle";

/**
 * /icons/<style>/<slug>, e.g. /icons/linear/home: one page per icon and style.
 * Prerendered with the real SVG, title, description, canonical and structured data,
 * so each icon can be found on Google. Below the tools sits a short article about the icon, with a table of contents.
 */
export const Route = createFileRoute("/icons/$style/$slug")({
  validateSearch: validateToolSearch,
  loader: async ({ params }) => {
    if (!isStyle(params.style)) throw notFound();
    const [icons, article, variants] = await Promise.all([loadIcons(params.style), loadArticle(params.slug), loadVariants(params.slug)]);
    const icon = icons.find((i) => i.slug === params.slug);
    if (!icon) throw notFound();
    // Only what the page needs, so the HTML stays small: the icon, its article,
    // and the few icons it links to (same category + pairs) for crawlable links.
    const nearby = article ? icons.filter((i) => i.id !== icon.id && (i.category === icon.category || article.pairs.includes(i.slug))) : [];
    return { icon, article: article ? { ...article, nearby } : null, variants };
  },
  head: ({ params, loaderData }) => (loaderData && isStyle(params.style) ? iconHead(params.style, loaderData.icon, loaderData.article) : {}),
  component: IconPage,
});

function IconPage() {
  const { style, slug } = Route.useParams();
  const { icon, article, variants } = Route.useLoaderData();
  const search = Route.useSearch();
  if (!isStyle(style)) return null;
  return <IconsTool style={style} slug={slug} search={search} detail={icon} article={article ?? undefined} variants={variants ?? undefined} />;
}
