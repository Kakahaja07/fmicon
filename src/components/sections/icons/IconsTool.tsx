import type { ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { ToolTheme } from "~/hooks/useToolTheme";
import { idToSlug, slugToId, type ToolSearch } from "~/lib/iconSeo";
import type { IconArticle } from "~/lib/iconArticle";
import type { FreeIcon, IconStyle } from "~/lib/svg";
import { IconBrowser, type BrowserSearch } from "./IconBrowser";
import { SiteHeader } from "~/components/sections/SiteHeader";
import { SiteFooter } from "~/components/sections/SiteFooter";
import { LibraryArticle } from "./LibraryArticle";

type IconsToolProps = {
  style: IconStyle;
  /** Set on icon pages: /icons/<style>/<slug> */
  slug?: string;
  search: ToolSearch;
  /** Page heading block (h1 + text), different per page type */
  intro?: ReactNode;
  /** Icon pages: the icon from the route loader (prerendered with the page) */
  detail?: FreeIcon;
  /** Icon pages: the article and style variants from the route loader */
  article?: IconArticle;
};

/**
 * The full-screen icon tool, shared by /icons, /icons/<style> and /icons/<style>/<slug>.
 * Style and icon live in the path (good URLs for search engines); filters stay in the query.
 */
export function IconsTool({ style, slug, search, intro, detail, article }: IconsToolProps) {
  const navigate = useNavigate();
  const theme: ToolTheme = "dark"; // the tool is dark-only, like the rest of the site

  const browserSearch: BrowserSearch = { ...search, style, icon: slug ? slugToId.get(slug) : undefined };

  const onChange = (patch: Partial<BrowserSearch>) => {
    const { style: nextStyleRaw, icon, ...filters } = patch;
    const keepSearch = (prev: ToolSearch): ToolSearch => ({ ...prev, ...filters });
    const changesPath = "style" in patch || "icon" in patch;

    if (!changesPath) {
      navigate({ to: ".", search: keepSearch, replace: true, resetScroll: false });
      return;
    }

    const nextStyle = "style" in patch ? (nextStyleRaw ?? "linear") : style;
    const id = "icon" in patch ? icon : browserSearch.icon;
    const nextSlug = id ? idToSlug.get(id) : undefined;

    if (nextSlug) {
      // Opening an icon is a real page, so Back closes it again.
      navigate({ to: "/icons/$style/$slug", params: { style: nextStyle, slug: nextSlug }, search: keepSearch, resetScroll: !("style" in patch), replace: "style" in patch });
    } else if (nextStyle === "linear") {
      navigate({ to: "/icons", search: keepSearch, resetScroll: false });
    } else {
      navigate({ to: "/icons/$style", params: { style: nextStyle }, search: keepSearch, resetScroll: false });
    }
  };

  return (
    <>
      <SiteHeader />
      <main id="top">
        <IconBrowser
          search={browserSearch}
          onChange={onChange}
          theme={theme}
          intro={intro}
          detail={detail}
          article={article}
          // Only the "All" grid gets the written guide under the icons; a picked category or an icon page shows none
          after={slug || search.cat ? undefined : <LibraryArticle style={style} />}
        />
      </main>
      <SiteFooter />
    </>
  );
}
