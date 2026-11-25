import { freeIconsMeta } from "~/content/freeIcons.meta";
import { OptionTiles } from "~/components/ui/OptionTiles";
import { Segmented } from "~/components/ui/Segmented";
import { SvgIcon } from "~/components/ui/SvgIcon";
import type { ToolTheme } from "~/hooks/useToolTheme";
import { cx } from "~/lib/cx";
import { strokeStyles, strokeWeights, styleLabels, type IconStyle, type StrokeWeight } from "~/lib/svg";
import s from "./IconSidebar.module.css";

type IconSidebarProps = {
  style: IconStyle;
  theme: ToolTheme;
  size: number;
  weight: StrokeWeight;
  /** Weight only applies to line styles */
  weightEnabled: boolean;
  category?: string;
  onStyle: (style: IconStyle) => void;
  onWeight: (weight: StrokeWeight) => void;
  onSize: (size: number) => void;
  onCategory: (slug: string | undefined) => void;
};

// A curved stroke drawn at each weight (scaled up so the difference reads at a glance).
// Compact: the wave alone, with the name as its tooltip and in the section pill.
const weightOptions = strokeWeights.map((w) => ({
  value: w.value,
  title: w.label,
  label: (
    <svg className={s.wave} viewBox="0 0 24 12" aria-hidden="true">
      <path d="M2 8.5C5 2.5 8.5 2.5 12 6s7 3.5 10-2.5" strokeWidth={w.width * 1.3} />
    </svg>
  ),
}));

const lineStyleNames = [...strokeStyles].map((st) => styleLabels[st]).join(", ");

// Each chip shows the same bell in that style. Glass uses its light tone in light mode.
const styleOptions = (theme: ToolTheme) =>
  (freeIconsMeta.styles as readonly IconStyle[]).map((st) => ({
    value: st,
    label: styleLabels[st],
    visual: (
      <SvgIcon
        body={st === "glass" && theme === "light" ? freeIconsMeta.samplesLight.glass : freeIconsMeta.samples[st]}
        size={18}
      />
    ),
  }));

// The current style's bell drawn small, medium and large, so each size is visible before you pick it.
const sizeOptions = (sample: string) =>
  [
    { n: 24, draw: 11 },
    { n: 32, draw: 13 },
    { n: 48, draw: 16 },
  ].map(({ n, draw }) => ({
    value: String(n),
    title: `${n} px`,
    label: (
      <span className={s.sizeOpt}>
        <span className={s.sizeIcon}>
          <SvgIcon body={sample} size={draw} />
        </span>
        {n}
      </span>
    ),
  }));

export function IconSidebar(props: IconSidebarProps) {
  const { style, theme, size, weight, weightEnabled, category, onStyle, onWeight, onSize, onCategory } = props;
  const weightLabel = strokeWeights.find((w) => w.value === weight)?.label;
  const sample = style === "glass" && theme === "light" ? freeIconsMeta.samplesLight.glass : freeIconsMeta.samples[style];

  return (
    <aside className={s.side} aria-label="Filters">
      <div className={s.group}>
        <div className={s.head}>
          <span>Style</span>
          <span className={s.value}>{styleLabels[style]}</span>
        </div>
        <OptionTiles label="Icon style" value={style} options={styleOptions(theme)} onChange={onStyle} />
      </div>

      {/* Weight and size together: two slim rows under one heading */}
      <div className={s.group}>
        <div className={s.head}>
          <span>Weight & size</span>
          <span className={s.value}>
            {weightEnabled ? weightLabel : "Filled"} · {size} px
          </span>
        </div>
        <Segmented
          label="Stroke weight"
          value={weight}
          options={weightOptions}
          onChange={onWeight}
          disabled={!weightEnabled}
          className={s.compactRow}
        />
        <Segmented label="Preview size" value={String(size)} options={sizeOptions(sample)} onChange={(v) => onSize(Number(v))} className={s.compactRow} />
        {!weightEnabled && <p className={s.hint}>Weight changes the stroke on {lineStyleNames} icons.</p>}
      </div>

      <div className={s.group}>
        <div className={s.head}>
          <span>Category</span>
        </div>

        {/* Phones: a compact select instead of the long list */}
        <label className={s.select}>
          <span className="sr-only">Category</span>
          <select value={category ?? ""} onChange={(e) => onCategory(e.target.value || undefined)}>
            <option value="">All categories ({freeIconsMeta.total})</option>
            {freeIconsMeta.categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label} ({c.count})
              </option>
            ))}
          </select>
        </label>

        <ul className={s.list}>
          <li>
            <button type="button" className={cx(s.row, !category && s.on)} aria-pressed={!category} onClick={() => onCategory(undefined)}>
              All
              <span>{freeIconsMeta.total}</span>
            </button>
          </li>
          {freeIconsMeta.categories.map((c) => (
            <li key={c.slug}>
              <button
                type="button"
                className={cx(s.row, category === c.slug && s.on)}
                aria-pressed={category === c.slug}
                onClick={() => onCategory(category === c.slug ? undefined : c.slug)}
              >
                {c.label}
                <span>{c.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
