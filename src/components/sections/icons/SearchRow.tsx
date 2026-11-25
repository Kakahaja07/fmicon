import { useEffect, useRef } from "react";
import { SidebarLeftIcon, SortIcon } from "~/components/icons/Icons";
import { SearchField } from "~/components/ui/SearchField";
import { cx } from "~/lib/cx";
import s from "./SearchRow.module.css";

export type IconSort = "default" | "az";

type SearchRowProps = {
  query: string;
  onQuery: (q: string) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  sort: IconSort;
  onSort: (sort: IconSort) => void;
};

/**
 * The tool's search, inside the page: show/hide filters · search · A–Z sort.
 * "/" focuses it from anywhere on the page.
 */
export function SearchRow({ query, onQuery, sidebarOpen, onToggleSidebar, sort, onSort }: SearchRowProps) {
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && e.target.closest("input, textarea, select");
      if (e.key === "/" && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const az = sort === "az";
  return (
    <div className={s.row}>
      <button
        type="button"
        className={cx(s.square, sidebarOpen && s.on)}
        onClick={onToggleSidebar}
        aria-pressed={sidebarOpen}
        aria-label={sidebarOpen ? "Hide filters" : "Show filters"}
        title={sidebarOpen ? "Hide filters" : "Show filters"}
      >
        <SidebarLeftIcon size={18} />
      </button>
      <div className={s.search}>
        <SearchField ref={searchRef} label="Search icons" placeholder="Search icons, e.g. wallet, arrow, chat" value={query} onChange={onQuery} shortcut="/" />
      </div>
      <button
        type="button"
        className={cx(s.square, az && s.on)}
        onClick={() => onSort(az ? "default" : "az")}
        aria-pressed={az}
        aria-label={az ? "Sort by popular" : "Sort A to Z"}
        title={az ? "Sorted A–Z (click for popular first)" : "Popular first (click for A–Z)"}
      >
        <SortIcon size={18} />
      </button>
    </div>
  );
}
