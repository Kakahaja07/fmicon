import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { iconTool, library } from "~/content/site";
import { freeIconsMeta } from "~/content/freeIcons.meta";
import { ArrowRightIcon, CopyIcon, SearchNormalIcon, TickCircleIcon } from "~/components/icons/Icons";
import { ColorSwatches, type Swatch } from "~/components/ui/ColorSwatches";
import { SvgIcon } from "~/components/ui/SvgIcon";
import { loadPreview } from "~/hooks/useIconStyle";
import { cx } from "~/lib/cx";
import { componentName, fixedColorStyles, humanName, styleLabels, type FreeIcon, type IconStyle } from "~/lib/svg";
import s from "./AppWindow.module.css";

const swatches: Swatch[] = [
  { value: "currentColor", label: "Default", paint: "var(--text)" },
  { value: "#4d8fff", label: "Blue", paint: "#4d8fff" },
  { value: "#ff8d28", label: "Orange", paint: "#ff8d28" },
  { value: "#34c759", label: "Green", paint: "#34c759" },
  { value: "#cb30e0", label: "Purple", paint: "#cb30e0" },
  { value: "#ff383c", label: "Red", paint: "#ff383c" },
];

type Item = { key: string; name: string; slug?: string; draw: (size: number, color?: string) => ReactNode };

// Linear is drawn from the built-in components (ready on first paint); other styles load the real free icons.
const linearItems: Item[] = library.icons.map(({ name, icon: Icon }) => ({
  key: name,
  name,
  draw: (size, color) => <Icon size={size} color={color} />,
}));
const toItems = (icons: FreeIcon[]): Item[] =>
  icons.map((icon) => ({ key: icon.id, name: icon.name, slug: icon.slug, draw: (size, color) => <SvgIcon body={icon.body} size={size} color={color} /> }));

/**
 * A working miniature of the app: switch styles, search, pick an icon,
 * recolour it and copy it. Shows the product instead of describing it.
 */
export function AppWindow() {
  const [style, setStyle] = useState<IconStyle>("linear");
  const [loaded, setLoaded] = useState<Item[] | null>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [color, setColor] = useState("currentColor");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (style === "linear") return setLoaded(null);
    let live = true;
    loadPreview(style).then((icons) => live && setLoaded(toItems(icons)));
    return () => {
      live = false;
    };
  }, [style]);

  const items = style === "linear" ? linearItems : (loaded ?? linearItems);
  const results = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/\s+/g, "-");
    return (q ? items.filter((i) => i.name.includes(q)) : items).slice(0, 40);
  }, [items, query]);

  const current = results.find((i) => i.key === selected) ?? items.find((i) => i.name === library.defaultSelected) ?? items[0];
  const fixed = fixedColorStyles.has(style);
  const ink = fixed || color === "currentColor" ? undefined : color;
  const name = componentName(current.name);

  const copy = () => {
    navigator.clipboard?.writeText(`<${name} size={24} />`).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className={s.window} role="group" aria-label="Interactive preview of the FM Icons app">
      <div className={s.titlebar}>
        <span className={s.lights} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className={s.windowTitle}>FM Icons — {styleLabels[style]}</span>
      </div>

      <aside className={s.side}>
        <div className={s.sideLabel}>{library.sidebar.libraryLabel}</div>
        {library.sidebar.library.map((row) => (
          <div key={row.name} className={s.sideRow}>
            <i style={{ "--d": `var(--${row.color})` } as CSSProperties} />
            {row.name}
            <span>{row.count}</span>
          </div>
        ))}

        <div className={s.sideLabel}>Styles</div>
        {(freeIconsMeta.styles as readonly IconStyle[]).map((st) => (
          <button
            key={st}
            type="button"
            className={cx(s.sideRow, s.styleRow, st === style && s.on)}
            aria-pressed={st === style}
            onClick={() => {
              setStyle(st);
              setSelected(null);
            }}
          >
            <SvgIcon body={freeIconsMeta.samples[st]} size={14} />
            {styleLabels[st]}
            <span>{freeIconsMeta.total}</span>
          </button>
        ))}
      </aside>

      <div className={s.main}>
        <label className={s.search}>
          <SearchNormalIcon size={14} />
          <span className="sr-only">Search icons</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${styleLabels[style].toLowerCase()} icons…`}
            autoComplete="off"
          />
        </label>
        <div className={s.title}>{styleLabels[style]}</div>
        <div className={s.crumb}>Styles → {styleLabels[style]}</div>

        {results.length ? (
          <div className={s.grid}>
            {results.map((item) => (
              <button
                key={item.key}
                type="button"
                className={s.cell}
                aria-pressed={item.key === current.key}
                aria-label={humanName(item.name)}
                title={humanName(item.name)}
                onClick={() => setSelected(item.key)}
              >
                {item.draw(22, item.key === current.key ? ink : undefined)}
              </button>
            ))}
          </div>
        ) : (
          <p className={s.empty}>
            No icons match “{query}”. <button onClick={() => setQuery("")}>Clear search</button>
          </p>
        )}

        <div className={s.foot}>
          <span>
            {results.length} shown · 1 selected
          </span>
          <Link to="/icons" className={s.footLink}>
            {iconTool.windowLink}
            <ArrowRightIcon size={12} />
          </Link>
        </div>
      </div>

      <aside className={s.inspector}>
        <div className={s.preview}>
          <span key={current.key + style} className={s.previewIcon}>
            {current.draw(64, ink)}
          </span>
        </div>
        <div className={s.name}>{humanName(current.name)}</div>
        <div className={s.h}>Colour</div>
        {fixed ? (
          <p className={s.fixedNote}>Glass keeps its own shading.</p>
        ) : (
          <ColorSwatches label="Preview colour" swatches={swatches} value={color} onChange={setColor} allowCustom={false} />
        )}
        <Field label="Style" value={styleLabels[style]} />
        <Field label="Size" value="24 px" />
        <button type="button" className={s.copy} onClick={copy}>
          {copied ? <TickCircleIcon size={14} /> : <CopyIcon size={14} />}
          {copied ? "Copied" : `<${name} />`}
        </button>
        {current.slug && (
          <Link to="/icons/$style/$slug" params={{ style, slug: current.slug }} className={s.openLink}>
            Open in free tool
            <ArrowRightIcon size={12} />
          </Link>
        )}
      </aside>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className={s.field}>
      {label}
      <b>{value}</b>
    </div>
  );
}
