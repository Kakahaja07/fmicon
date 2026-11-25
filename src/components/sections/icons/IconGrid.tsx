import { useRef, type CSSProperties, type KeyboardEvent } from "react";
import { openSource } from "~/content/site";
import { freeIconsMeta } from "~/content/freeIcons.meta";
import { Button } from "~/components/ui/Button";
import { SvgIcon } from "~/components/ui/SvgIcon";
import { iconPath } from "~/lib/iconSeo";
import { humanName, type FreeIcon, type IconStyle } from "~/lib/svg";
import s from "./IconGrid.module.css";

type IconGridProps = {
  status: "loading" | "error" | "ready";
  style: IconStyle;
  onRetry: () => void;
  icons: FreeIcon[];
  size: number;
  query: string;
  category?: string;
  selectedId?: string;
  onSelect: (id: string) => void;
  onClearFilters: () => void;
};


export function IconGrid(props: IconGridProps) {
  const { status, style, onRetry, icons, size, query, category, selectedId, onSelect, onClearFilters } = props;
  const gridRef = useRef<HTMLDivElement>(null);

  // Arrow keys move through the grid like a file browser.
  const onGridKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: 0, ArrowDown: 0 };
    if (!(e.key in keys) || !gridRef.current) return;
    const cell = (e.target as HTMLElement).closest<HTMLElement>("[data-index]");
    if (!cell) return;
    const cols = getComputedStyle(gridRef.current).gridTemplateColumns.split(" ").length;
    const step = e.key === "ArrowUp" ? -cols : e.key === "ArrowDown" ? cols : keys[e.key];
    const next = Number(cell.dataset.index) + step;
    if (next < 0 || next >= icons.length) return;
    e.preventDefault();
    gridRef.current.querySelector<HTMLElement>(`[data-index="${next}"]`)?.focus();
    onSelect(icons[next].id);
  };

  const filtered = Boolean(query || category);
  const summary =
    status !== "ready"
      ? "Loading icons…"
      : filtered
        ? `${icons.length} of ${freeIconsMeta.total} icons${category ? ` in ${category}` : ""}`
        : `${freeIconsMeta.total} icons`;

  return (
    <section className={s.main} aria-label="Icons">
      <p className={s.summary} aria-live="polite">
        {summary}
      </p>

      {status === "error" && (
        <div className={s.state}>
          <p>The icons didn't load. Check your connection and try again.</p>
          <Button variant="ghost" onClick={onRetry}>
            Try again
          </Button>
        </div>
      )}

      {status === "loading" && (
        <div className={s.grid} aria-hidden="true">
          {Array.from({ length: 32 }, (_, i) => (
            <div key={i} className={s.skeleton}>
              <i />
              <b />
            </div>
          ))}
        </div>
      )}

      {status === "ready" && icons.length === 0 && (
        <div className={s.state}>
          <p>
            No icons match <b>“{query || category}”</b>. Try another word, or ask for it on GitHub.
          </p>
          <div className={s.stateActions}>
            <Button variant="ghost" onClick={onClearFilters}>
              Clear filters
            </Button>
            <Button href={`${openSource.repo}/issues`} target="_blank" rel="noreferrer">Request an icon</Button>
          </div>
        </div>
      )}

      {status === "ready" && icons.length > 0 && (
        <>
          <div className={s.grid} ref={gridRef} onKeyDown={onGridKey} style={{ "--cell-icon": `${size}px` } as CSSProperties}>
            {icons.map((icon, i) => (
              // A real link to the icon page (crawlable, middle-click opens a tab); a plain click opens the dialog in place.
              <a
                key={icon.id}
                href={iconPath(style, icon.slug)}
                className={s.cell}
                data-index={i}
                aria-current={icon.id === selectedId || undefined}
                tabIndex={icon.id === selectedId || (!selectedId && i === 0) ? 0 : -1}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                  e.preventDefault();
                  onSelect(icon.id);
                }}
              >
                <SvgIcon body={icon.body} size={size} />
                <span className={s.label}>{humanName(icon.name)}</span>
              </a>
            ))}
          </div>

        </>
      )}
    </section>
  );
}
