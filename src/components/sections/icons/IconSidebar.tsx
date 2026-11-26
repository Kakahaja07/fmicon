import { Link } from "@tanstack/react-router";
import { freeIconsMeta } from "~/content/freeIcons.meta";
import { paymentsMeta } from "~/content/payments.meta";
import type { PaymentSize } from "./PaymentLogos";
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
  /** Set on /icons/payments: no style or category is picked, and size switches the logo card size */
  payments?: { size: PaymentSize; onSize: (size: PaymentSize) => void };
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

// Logo card sizes: a small card outline drawn at each size, like the bell on the icon sizes.
const paymentSizeLabel = (id: PaymentSize) => {
  const x = paymentsMeta.sizes.find((z) => z.id === id)!;
  return `${x.width}×${x.height}`;
};
const paymentSizeOptions = paymentsMeta.sizes.map((x) => ({
  value: x.id,
  title: `${x.label}, ${x.width} × ${x.height} px`,
  label: (
    <span className={s.sizeOpt}>
      <span className={s.sizeIcon}>
        <svg width={x.width / 3} height={x.height / 3} viewBox={`0 0 ${x.width} ${x.height}`} aria-hidden="true">
          <rect x="1.5" y="1.5" width={x.width - 3} height={x.height - 3} rx="5" fill="none" stroke="currentColor" strokeWidth="3" />
        </svg>
      </span>
      {x.id.toUpperCase()}
    </span>
  ),
}));

export function IconSidebar(props: IconSidebarProps) {
  const { style, theme, size, weight, weightEnabled, category, onStyle, onWeight, onSize, onCategory, payments } = props;
  // On the payments page the icon filters stay, so you can jump back, but none is picked.
  const inIcons = !payments;
  const weightLabel = strokeWeights.find((w) => w.value === weight)?.label;
  const sample = style === "glass" && theme === "light" ? freeIconsMeta.samplesLight.glass : freeIconsMeta.samples[style];

  return (
    <aside className={s.side} aria-label="Filters">
      <div className={s.group}>
        <div className={s.head}>
          <span>Style</span>
          <span className={s.value}>{inIcons ? styleLabels[style] : "Full colour"}</span>
        </div>
        <OptionTiles label="Icon style" value={inIcons ? style : ("" as IconStyle)} options={styleOptions(theme)} onChange={onStyle} />
      </div>

      {payments ? (
        <div className={s.group}>
          <div className={s.head}>
            <span>Size</span>
            <span className={s.value}>{paymentSizeLabel(payments.size)}</span>
          </div>
          <Segmented label="Logo size" value={payments.size} options={paymentSizeOptions} onChange={payments.onSize} className={s.compactRow} />
        </div>
      ) : (
        <>
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
        </>
      )}

      <div className={s.group}>
        <div className={s.head}>
          <span>Category</span>
        </div>

        {/* Phones: a compact select instead of the long list */}
        <label className={s.select}>
          <span className="sr-only">Category</span>
          <select value={category ?? ""} onChange={(e) => onCategory(e.target.value || undefined)}>
            <option value="">{inIcons ? `All categories (${freeIconsMeta.total})` : "Pick a category"}</option>
            {freeIconsMeta.categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label} ({c.count})
              </option>
            ))}
          </select>
        </label>

        <ul className={s.list}>
          <li>
            <button type="button" className={cx(s.row, inIcons && !category && s.on)} aria-pressed={inIcons && !category} onClick={() => onCategory(undefined)}>
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

      {/* Full-colour sets that don't come in the styles above */}
      <div className={s.group}>
        <div className={s.head}>
          <span>More sets</span>
        </div>
        <ul className={cx(s.list, s.sets)}>
          <li>
            <Link to="/icons/payments" className={cx(s.row, payments && s.on)} aria-current={payments ? "page" : undefined}>
              Payment logos
              <span>{paymentsMeta.logos.length}</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
