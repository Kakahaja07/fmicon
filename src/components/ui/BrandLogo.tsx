import { brand } from "~/content/site";
import { AppIcon } from "./AppIcon";
import s from "./BrandLogo.module.css";

/** App icon + product name, links back to the top. */
export function BrandLogo({ size = 32 }: { size?: number }) {
  return (
    <a className={s.brand} href="/">
      <AppIcon size={size} />
      {brand.name}
    </a>
  );
}
