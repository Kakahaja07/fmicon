import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { freeIconsMeta } from "~/content/freeIcons.meta";
import { useIconStyle } from "~/hooks/useIconStyle";
import type { ToolTheme } from "~/hooks/useToolTheme";
import type { IconArticle, IconVariants } from "~/lib/iconArticle";
import { strokeStyles, strokeWidthOf, type FreeIcon, type IconStyle, type StrokeWeight } from "~/lib/svg";
import { IconGrid } from "./IconGrid";
import { IconDetail } from "./IconDetail";
import { IconSidebar } from "./IconSidebar";
import { SearchRow, type IconSort } from "./SearchRow";
import s from "./IconBrowser.module.css";

export type BrowserSearch = {
  q?: string;
  style?: IconStyle;
  cat?: string;
  icon?: string;
  size?: number;
  weight?: StrokeWeight;
};

type IconBrowserProps = {
  search: BrowserSearch;
  onChange: (patch: Partial<BrowserSearch>) => void;
  theme: ToolTheme;
  /** On an icon page: the icon from the page loader, so the detail renders before the list loads */
  detail?: FreeIcon;
  /** On an icon page: its article and style variants (belongs to `detail`) */
  article?: IconArticle;
  /** On an icon page: the icon in every style (belongs to `detail`) */
  variants?: IconVariants;
  /** Heading at the top of the centre column (the page h1) */
  intro?: ReactNode;
  /** Shown under the icons in the centre column (the open-source panel), so the sidebar stays pinned beside it. */
  after?: ReactNode;
  /** Last thing in the centre column, e.g. the link index */
  footer?: ReactNode;
};

export const DEFAULT_SIZE = 24;
export const DEFAULT_WEIGHT: StrokeWeight = "thin";

const categoryLabel = new Map<string, string>(freeIconsMeta.categories.map((c) => [c.slug, c.label]));

const SIDEBAR_KEY = "fmicon-sidebar";
const SORT_KEY = "fmicon-sort";

/** Filters open or closed, and the sort order: remembered on this device. Phones start with filters closed. */
function useToolPrefs() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sort, setSort] = useState<IconSort>("default");
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SIDEBAR_KEY);
      setSidebarOpen(saved ? saved === "open" : !window.matchMedia("(max-width: 900px)").matches);
      if (localStorage.getItem(SORT_KEY) === "az") setSort("az");
    } catch {
      /* storage blocked: defaults */
    }
  }, []);
  const save = (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* storage blocked */
    }
  };
  return {
    sidebarOpen,
    toggleSidebar: () =>
      setSidebarOpen((open) => {
        save(SIDEBAR_KEY, open ? "closed" : "open");
        return !open;
      }),
    sort,
    setSort: (next: IconSort) => {
      setSort(next);
      save(SORT_KEY, next);
    },
  };
}

/** Full-width workspace: filters · grid (+ offer). An icon opens as its own page in the centre column. All state lives in the URL. */
export function IconBrowser({ search, onChange, theme, detail, article, variants, intro, after, footer }: IconBrowserProps) {
  const style = search.style ?? "linear";
  // Defaults: thin strokes at 24 px. Only non-default choices go into the URL.
  const size = search.size ?? DEFAULT_SIZE;
  const weight = search.weight ?? DEFAULT_WEIGHT;
  const query = search.q ?? "";
  const data = useIconStyle(style, theme);
  const prefs = useToolPrefs();

  // Weight only applies to line styles; filled styles keep their shapes.
  const stroke = strokeStyles.has(style) ? strokeWidthOf(weight) : undefined;

  const icons = data.status === "ready" ? data.icons : [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/\s+/g, "-");
    const list = icons.filter((icon) => {
      if (search.cat && icon.category !== search.cat) return false;
      if (!q) return true;
      const label = categoryLabel.get(icon.category)?.toLowerCase() ?? "";
      return icon.name.includes(q) || label.includes(q.replace(/-/g, " "));
    });
    return prefs.sort === "az" ? [...list].sort((a, b) => a.name.localeCompare(b.name)) : list;
  }, [icons, query, search.cat, prefs.sort]);

  // The icon page: from the loaded list once it's there, from the page loader before that (and when prerendering).
  const selected =
    icons.find((i) => i.id === search.icon) ?? (detail && detail.id === search.icon ? detail : null);

  return (
    <div
      className={s.workspace}
      style={stroke ? ({ "--stroke": stroke } as CSSProperties) : undefined}
      data-stroke={stroke ? "" : undefined}
      data-detail={selected ? "" : undefined}
      data-sidebar={!selected && prefs.sidebarOpen ? "" : undefined}
    >
      {/* Filters only on the grid, and only when shown; an icon page uses the full width */}
      {!selected && prefs.sidebarOpen && (
      <IconSidebar
        style={style}
        theme={theme}
        size={size}
        weight={weight}
        weightEnabled={strokeStyles.has(style)}
        category={search.cat}
        onStyle={(v) => onChange({ style: v === "linear" ? undefined : v })}
        onWeight={(v) => onChange({ weight: v === DEFAULT_WEIGHT ? undefined : v })}
        onSize={(v) => onChange({ size: v === DEFAULT_SIZE ? undefined : v })}
        onCategory={(v) => onChange({ cat: v })}
      />
      )}

      <div className={s.center}>
        {selected ? (
          <IconDetail
            icon={selected}
            icons={filtered.length ? filtered : icons}
            style={style}
            size={size}
            weight={weight}
            tone={theme}
            article={detail && detail.id === selected.id ? article : undefined}
            variants={detail && detail.id === selected.id ? variants : undefined}
            onNavigate={(id) => onChange({ icon: id })}
            onBack={() => onChange({ icon: undefined })}
          />
        ) : (
          <>
            {intro}
            <SearchRow
              query={query}
              onQuery={(q) => onChange({ q: q || undefined })}
              sidebarOpen={prefs.sidebarOpen}
              onToggleSidebar={prefs.toggleSidebar}
              sort={prefs.sort}
              onSort={prefs.setSort}
            />
            <IconGrid
          status={data.status}
          style={style}
          onRetry={data.retry}
          icons={filtered}
          size={size}
          query={query}
          category={search.cat ? categoryLabel.get(search.cat) : undefined}
          onSelect={(id) => onChange({ icon: id })}
          onClearFilters={() => onChange({ q: undefined, cat: undefined })}
            />
          </>
        )}
        {after && <div className={s.after}>{after}</div>}
        {footer}
      </div>

    </div>
  );
}
