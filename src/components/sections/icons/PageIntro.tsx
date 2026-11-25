import { freeIconsMeta } from "~/content/freeIcons.meta";
import { styleLabels, type IconStyle } from "~/lib/svg";
import s from "./PageIntro.module.css";

/** Heading for /icons and /icons/<style>: one h1 and one line of what you can do here. */
export function LibraryIntro({ style }: { style?: IconStyle }) {
  const label = style ? styleLabels[style] : null;
  return (
    <header className={s.intro}>
      <h1 className={s.h1}>{label ? `Free ${label.toLowerCase()} icons` : "Free, open-source icons"}</h1>
      <p className={s.text}>
        {freeIconsMeta.total} open-source icons{label ? ` in the ${label.toLowerCase()} style` : `, ${freeIconsMeta.styles.length} styles`}.
        Click any icon to recolour it, resize it and copy it as SVG, PNG or code.
      </p>
    </header>
  );
}
