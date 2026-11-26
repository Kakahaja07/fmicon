import { createFileRoute, notFound } from "@tanstack/react-router";
import { IconsTool } from "~/components/sections/icons/IconsTool";
import { LibraryIntro } from "~/components/sections/icons/PageIntro";
import { isStyle, styleHead, validateToolSearch } from "~/lib/iconSeo";

/** /icons/<style>, e.g. /icons/duotone: every free icon in one style. */
export const Route = createFileRoute("/icons/$style/")({
  validateSearch: validateToolSearch,
  beforeLoad: ({ params }) => {
    if (!isStyle(params.style)) throw notFound();
  },
  head: ({ params }) => (isStyle(params.style) ? styleHead(params.style) : {}),
  component: StylePage,
});

function StylePage() {
  const { style } = Route.useParams();
  const search = Route.useSearch();
  if (!isStyle(style)) return null;
  return <IconsTool style={style} search={search} intro={<LibraryIntro style={style} category={search.cat} />} />;
}
