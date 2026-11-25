import { createFileRoute } from "@tanstack/react-router";
import { IconsTool } from "~/components/sections/icons/IconsTool";
import { LibraryIntro } from "~/components/sections/icons/PageIntro";
import { libraryHead, validateToolSearch } from "~/lib/iconSeo";

/** /icons: the free icon library (linear style). Full-screen tool, no site header or footer. */
export const Route = createFileRoute("/icons/")({
  validateSearch: validateToolSearch,
  head: libraryHead,
  component: LibraryPage,
});

function LibraryPage() {
  const search = Route.useSearch();
  return <IconsTool style="linear" search={search} intro={<LibraryIntro />} />;
}
