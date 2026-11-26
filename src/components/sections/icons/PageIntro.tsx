import { freeIconsMeta } from "~/content/freeIcons.meta";
import { styleLabels, type IconStyle } from "~/lib/svg";
import s from "./PageIntro.module.css";
import { titleCase } from "~/lib/titleCase";

/**
 * Heading for /icons and /icons/<style>: one h1 and one line of what you can do here.
 * With a category picked it names it: "Free Security Color Icons", "28 open-source security icons…".
 */
export function LibraryIntro({ style, category }: { style?: IconStyle; category?: string }) {
  const label = style ? styleLabels[style] : null;
  const cat = category ? freeIconsMeta.categories.find((c) => c.slug === category) : undefined;
  const count = cat ? cat.count : freeIconsMeta.total;
  const kind = cat ? `${cat.label} icons` : "icons";
  const heading = cat
    ? `Free ${cat.label}${label ? ` ${label}` : ""} Icons`
    : label
      ? `Free ${label.toLowerCase()} icons`
      : "Free, open-source icons";
  const action =
    style === "color"
      ? "Pick a hue, then click any icon to resize it and copy it as SVG, PNG or code."
      : "Click any icon to recolour it, resize it and copy it as SVG, PNG or code.";
  return (
    <header className={s.intro}>
      <h1 className={s.h1}>{titleCase(heading)}</h1>
      <p className={s.text}>
        {count} open-source {kind}
        {label ? ` in the ${label.toLowerCase()} style` : cat ? "" : `, ${freeIconsMeta.styles.length} styles`}. {action}
      </p>
    </header>
  );
}
