import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import type { ToolTheme } from "~/hooks/useToolTheme";
import type { IconArticle as Article, IconVariants } from "~/lib/iconArticle";
import { freeIconsMeta } from "~/content/freeIcons.meta";
import {
  CodeIcon,
  CopyIcon,
  DocumentDownloadIcon,
  LinkIcon,
  RefreshCircleIcon,
  TickCircleIcon,
} from "~/components/icons/Icons";
import { Button } from "~/components/ui/Button";
import { CodeBlock } from "~/components/ui/CodeBlock";
import { CommandLine } from "~/components/ui/CommandLine";
import { ColorField } from "~/components/ui/ColorField";
import { ColorSwatches, type Swatch } from "~/components/ui/ColorSwatches";
import { Segmented } from "~/components/ui/Segmented";
import { Slider } from "~/components/ui/Slider";
import { SvgIcon } from "~/components/ui/SvgIcon";
import { Switch } from "~/components/ui/Switch";
import { Tabs } from "~/components/ui/Tabs";
import { FrameworkLogo } from "~/components/ui/FrameworkLogo";
import { iconPath, labelForCategory } from "~/lib/iconSeo";
import {
  codeFor,
  componentName,
  downloadImage,
  downloadText,
  fixedColorStyles,
  frameworks,
  humanName,
  shortenPaths,
  strokeStyles,
  strokeWeights,
  strokeWidthOf,
  styleLabels,
  toReact,
  toSvg,
  type FreeIcon,
  type Framework,
  type IconStyle,
  type StrokeWeight,
} from "~/lib/svg";
import { IconArticle } from "./IconArticle";
import { iconUseCopy } from "~/lib/iconUseCopy";
import { ArrowLeft2TwotoneIcon, ArrowRight2TwotoneIcon, Home2TwotoneIcon } from "~/components/icons/Icons";
import s from "./IconDetail.module.css";
import { titleCase } from "~/lib/titleCase";

const backdrops: Swatch[] = [
  { value: "checker", label: "Checkerboard", paint: "repeating-conic-gradient(#8a8a8e 0 25%, #d4d4d8 0 50%) 50% / 8px 8px" },
  { value: "light", label: "Light", paint: "#f5f5f7" },
  { value: "dark", label: "Dark", paint: "#161617" },
  { value: "blue", label: "Blue", paint: "linear-gradient(160deg, #5fb4ff, #1265ec)" },
];

const presets: Swatch[] = [
  { value: "#1265ec", label: "Blue", paint: "#1265ec" },
  { value: "#ff383c", label: "Red", paint: "#ff383c" },
  { value: "#ff8d28", label: "Orange", paint: "#ff8d28" },
  { value: "#34c759", label: "Green", paint: "#34c759" },
  { value: "#00b8c4", label: "Teal", paint: "#00b8c4" },
  { value: "#cb30e0", label: "Purple", paint: "#cb30e0" },
];

const exportSizes = [16, 24, 32, 48, 64, 128, 256, 512].map((n) => ({ value: String(n), label: String(n) }));
// Tabs backed by a real package (and so the props table)
const packageFrameworks: ReadonlySet<Framework> = new Set(["react", "react-native", "vue", "svelte"]);
const frameworkTabs = frameworks.map((f) => ({ value: f.value, label: f.label, icon: <FrameworkLogo framework={f.value} size={15} /> }));
const weightOptions = strokeWeights.map((w) => ({ value: w.value, label: w.label }));

type IconDetailProps = {
  icon: FreeIcon;
  /** The visible list, for previous / next and related icons */
  icons: FreeIcon[];
  style: IconStyle;
  /** Starting values, from the sidebar */
  size: number;
  weight: StrokeWeight;
  /** Tool theme: glass has its own light-tone artwork */
  tone: ToolTheme;
  /** Article and the icon in every style; prerendered with the page */
  article?: Article;
  /** The icon in every style (from the page loader) */
  variants?: IconVariants;
  onNavigate: (id: string) => void;
  onBack: () => void;
};

/**
 * One icon, as a full page in the tool: preview and customisation on the left,
 * copy, export and code on the right, related icons below. Prerendered for search engines.
 */
export function IconDetail(props: IconDetailProps) {
  const { icon, icons, style, tone, article, variants, onNavigate, onBack } = props;
  const [size, setSize] = useState(props.size);
  const [weight, setWeight] = useState<StrokeWeight>(props.weight);
  const [customColor, setCustomColor] = useState(false);
  const [color, setColor] = useState("#1265ec");
  const [backdrop, setBackdrop] = useState("checker");
  const [framework, setFramework] = useState<Framework>("react");
  const [flash, setFlash] = useState<string | null>(null);
  const timer = useRef(0);

  useEffect(() => setSize(props.size), [props.size]);
  useEffect(() => setWeight(props.weight), [props.weight]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const index = icons.findIndex((i) => i.id === icon.id);
  const go = (step: number) => {
    if (index < 0 || !icons.length) return;
    onNavigate(icons[(index + step + icons.length) % icons.length].id);
  };

  // ← → step through icons (not while typing or using a control)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest("input, select, textarea, [role=tab], [role=radio]")) return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const isLine = strokeStyles.has(style);
  const fixedColor = fixedColorStyles.has(style);
  const stroke = isLine ? strokeWidthOf(weight) : undefined;
  const exportColor = !fixedColor && customColor ? color : undefined;

  const name = componentName(icon.name);
  const title = humanName(icon.name);
  const category = labelForCategory(icon.category);
  const svg = toSvg(icon, size, exportColor, stroke);
  const code = codeFor(framework, icon, style, size, exportColor, stroke);
  const fw = frameworks.find((f) => f.value === framework)!;
  // Before the full list loads (and when prerendering) the loader supplies the nearby icons
  const pool = icons.length ? icons : (article?.nearby ?? []);
  const related = pool.filter((i) => i.category === icon.category && i.id !== icon.id).slice(0, 12);
  const pairs = (article?.pairs ?? []).map((slug) => pool.find((i) => i.slug === slug)).filter((i): i is FreeIcon => !!i);
  const variantBody = (st: IconStyle) =>
    (st === "glass" && tone === "light" ? (variants?.["glass-light"] ?? article?.glassLight) : (variants?.[st] ?? article?.variants[st])) ??
    (st === style ? icon.body : freeIconsMeta.samples[st]);

  const show = (text: string) => {
    setFlash(text);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setFlash(null), 1600);
  };
  const copy = async (text: string, done: string) => {
    try {
      await navigator.clipboard.writeText(text);
      show(done);
    } catch {
      show("Copy blocked by the browser");
    }
  };
  const ink = () => exportColor ?? getComputedStyle(document.documentElement).getPropertyValue("--text").trim();
  const reset = () => {
    setSize(props.size);
    setWeight(props.weight);
    setCustomColor(false);
    setBackdrop("checker");
  };

  return (
    <article className={s.detail} style={{ "--stroke": stroke ?? 1.5 } as CSSProperties}>
      {/* Where you are, and how to move on */}
      <header className={s.bar}>
        {/* Breadcrumb: All icons is home; category and style are links back into the grid */}
        <nav className={s.crumbs} aria-label="Breadcrumb">
          <Link to="/icons" className={s.home} onClick={(e) => (e.preventDefault(), onBack())}>
            <Home2TwotoneIcon size={16} />
            All icons
          </Link>
          <ArrowRight2TwotoneIcon size={14} className={s.sep} />
          <Link to="/icons" search={{ cat: icon.category }} className={s.crumb}>
            {category}
          </Link>
          <ArrowRight2TwotoneIcon size={14} className={s.sep} />
          {style === "linear" ? (
            <Link to="/icons" className={s.crumb}>
              {styleLabels[style]}
            </Link>
          ) : (
            <Link to="/icons/$style" params={{ style }} className={s.crumb}>
              {styleLabels[style]}
            </Link>
          )}
          <ArrowRight2TwotoneIcon size={14} className={s.sep} />
          <b aria-current="page">{icon.name}</b>
        </nav>
        <div className={s.barEnd}>
          {index >= 0 && (
            <span className={s.counter}>
              {index + 1} / {icons.length}
            </span>
          )}
          {/* Previous / next as one joined control */}
          <div className={s.stepper} role="group" aria-label="Browse icons">
            <button type="button" onClick={() => go(-1)} aria-label="Previous icon" title="Previous (←)">
              <ArrowLeft2TwotoneIcon size={18} />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next icon" title="Next (→)">
              <ArrowRight2TwotoneIcon size={18} />
            </button>
          </div>
          <button type="button" className={s.iconBtn} onClick={() => copy(window.location.href, "Link copied")} aria-label="Copy link" title="Copy link">
            <LinkIcon size={18} />
          </button>
        </div>
      </header>

      <div className={s.layout}>
        {/* Left: preview, name, customise */}
        <aside className={s.left}>
          <div className={s.preview} data-bg={backdrop}>
            <SvgIcon key={icon.id + style} body={icon.body} size={Math.min(Math.max(size * 2, 64), 160)} color={exportColor} className={s.previewIcon} />
          </div>
          <div className={s.backdrops}>
            <span>Background</span>
            <ColorSwatches label="Preview background" swatches={backdrops} value={backdrop} onChange={setBackdrop} allowCustom={false} />
          </div>

          <div className={s.nameRow}>
            <div>
              <h1 className={s.title}>{titleCase(`${title} icon`)}</h1>
              <p className={s.meta}>
                {category} · {styleLabels[style]}
              </p>
            </div>
            <code className={s.slug}>{icon.slug}</code>
          </div>

          <div className={s.panel}>
            <div className={s.panelHead}>
              <span>Customise</span>
              <button type="button" className={s.iconBtn} onClick={reset} aria-label="Reset" title="Reset">
                <RefreshCircleIcon size={16} />
              </button>
            </div>

            <div className={s.field}>
              <span className={s.label}>Stroke</span>
              <Segmented label="Stroke weight" value={weight} options={weightOptions} onChange={setWeight} size="sm" disabled={!isLine} />
            </div>

            <Slider label="Size" value={size} min={16} max={512} step={4} valueText={`${size} px`} onChange={setSize} />

            <Switch label="Custom colour" checked={customColor && !fixedColor} onChange={setCustomColor} disabled={fixedColor} />
            {customColor && !fixedColor && (
              <div className={s.colorRow}>
                <ColorField label="Colour" value={color} onChange={setColor} />
                <ColorSwatches label="Colour presets" swatches={presets} value={color} onChange={setColor} allowCustom={false} />
              </div>
            )}
            {fixedColor && <p className={s.hint}>{styleLabels[style]} icons keep their own shading.</p>}
          </div>
        </aside>

        {/* Right: copy, export, code */}
        <div className={s.right}>
          <nav className={s.styles} aria-label={`${title} icon in other styles`}>
            {(freeIconsMeta.styles as readonly IconStyle[]).map((st) => (
              <Link
                key={st}
                to="/icons/$style/$slug"
                params={{ style: st, slug: icon.slug }}
                replace
                resetScroll={false}
                className={s.styleTile}
                aria-current={st === style ? "page" : undefined}
                title={`${title} icon, ${styleLabels[st].toLowerCase()} style`}
              >
                <SvgIcon body={variantBody(st)} size={22} />
                <span>{styleLabels[st]}</span>
              </Link>
            ))}
          </nav>

          <section className={s.card} aria-label="Copy and export">
            <div className={s.copyRow}>
              <Button variant="ghost" icon={flash === "Copied JSX" ? TickCircleIcon : CodeIcon} onClick={() => copy(toReact(icon, size, exportColor, stroke), "Copied JSX")}>
                Copy JSX
              </Button>
              <Button variant="ghost" icon={flash === "Copied name" ? TickCircleIcon : CopyIcon} onClick={() => copy(name, "Copied name")}>
                Copy name
              </Button>
              <Button variant="ghost" icon={flash === "Copied SVG" ? TickCircleIcon : CopyIcon} onClick={() => copy(svg, "Copied SVG")}>
                Copy SVG
              </Button>
            </div>

            <div className={s.sizeHead}>
              <span className={s.label}>Export size</span>
              <span className={s.sizeValue}>{size}px</span>
            </div>
            <Segmented label="Export size" value={String(size)} options={exportSizes} onChange={(v) => setSize(Number(v))} size="sm" />

            <div className={s.copyRow}>
              <Button variant="ghost" icon={DocumentDownloadIcon} onClick={() => (downloadText(`${icon.name}-${style}.svg`, svg), show("Downloaded SVG"))}>
                SVG
              </Button>
              <Button
                variant="ghost"
                icon={DocumentDownloadIcon}
                onClick={() => (downloadImage(`${icon.name}-${style}-${size}.png`, toSvg(icon, size, ink(), stroke), size), show("Downloaded PNG"))}
              >
                PNG
              </Button>
              <Button
                variant="ghost"
                icon={DocumentDownloadIcon}
                onClick={() => (downloadImage(`${icon.name}-${style}-${size}.webp`, toSvg(icon, size, ink(), stroke), size, "image/webp"), show("Downloaded WebP"))}
              >
                WebP
              </Button>
            </div>
            <p className={s.status} aria-live="polite">
              {flash ?? " "}
            </p>
          </section>

          <section className={s.codeArea} aria-label="Code">
            <Tabs label="Framework" value={framework} options={frameworkTabs} onChange={setFramework} />
            {fw.install && <CommandLine command={fw.install} onCopy={() => copy(fw.install!, "Copied command")} copied={flash === "Copied command"} />}
            <CodeBlock
              className={s.codeBlock}
              filename={fw.file(icon.name)}
              code={shortenPaths(code)}
              onCopy={() => copy(code, `Copied ${fw.label}`)}
              copied={flash === `Copied ${fw.label}`}
            />
          </section>

          {packageFrameworks.has(framework) && (
            <section aria-labelledby="props-title">
              <h2 id="props-title" className={s.sectionTitle}>
                Props
              </h2>
              <table className={s.props}>
                <thead>
                  <tr>
                    <th>Prop</th>
                    <th>Type</th>
                    <th>Default</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code className={s.prop}>size</code></td>
                    <td><code>number | string</code></td>
                    <td><code>24</code></td>
                    <td>Width and height in pixels</td>
                  </tr>
                  <tr>
                    <td><code className={s.prop}>variant</code></td>
                    <td><code>"linear" | "bold" | …</code></td>
                    <td><code>linear</code></td>
                    <td>Any of the 8 styles, plus glass-light for light backgrounds</td>
                  </tr>
                  <tr>
                    <td><code className={s.prop}>color</code></td>
                    <td><code>string</code></td>
                    <td><code>currentColor</code></td>
                    <td>Any CSS colour; inherits the text colour by default</td>
                  </tr>
                  <tr>
                    <td><code className={s.prop}>strokeWidth</code></td>
                    <td><code>number</code></td>
                    <td><code>1.5</code></td>
                    <td>Line weight for linear, twotone, broken and duotone</td>
                  </tr>
                  <tr>
                    <td><code className={s.prop}>...props</code></td>
                    <td><code>SVG attributes</code></td>
                    <td>–</td>
                    <td>className, aria-label, onClick and the rest</td>
                  </tr>
                </tbody>
              </table>
            </section>
          )}
        </div>
      </div>

      {/* Keep exploring */}
      {related.length > 0 && (
        <section className={s.more} aria-labelledby="related-title">
          <h2 id="related-title" className={s.sectionTitle}>
            {titleCase(`More in ${category}`)}
          </h2>
          <div className={s.related}>
            {related.map((r) => (
              <a
                key={r.id}
                href={iconPath(style, r.slug)}
                className={s.relatedCell}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                  e.preventDefault();
                  onNavigate(r.id);
                }}
              >
                <SvgIcon body={r.body} size={24} />
                <span>{humanName(r.name)}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {article ? (
        <IconArticle icon={icon} style={style} article={article} pairs={pairs} onNavigate={onNavigate} />
      ) : (
        (() => {
          const note = iconUseCopy(titleCase(humanName(icon.name)), icon.category, category, style);
          return (
            <section className={s.useNote} aria-labelledby="use-title">
              <h2 id="use-title">{note.title}</h2>
              {note.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </section>
          );
        })()
      )}
    </article>
  );
}
