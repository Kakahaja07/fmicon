import { useState, type CSSProperties } from "react";
import * as I from "~/components/icons/Icons";
import s from "./RecolorArt.module.css";

const swatches = [
  { hex: "#FF8D28", name: "Orange" },
  { hex: "#4D8FFF", name: "Blue" },
  { hex: "#34C759", name: "Green" },
  { hex: "#CB30E0", name: "Purple" },
  { hex: "#FF383C", name: "Red" },
];

// A whole set, bleeding off the sides so it reads as "everything", not a sample of twelve
const icons = [
  I.HomeBoldIcon, I.HeartBoldIcon, I.CameraBoldIcon, I.MusicBoldIcon, I.FolderBoldIcon, I.FlashBoldIcon,
  I.MagicStarBoldIcon, I.StarBoldIcon, I.MessageBoldIcon, I.DiamondsBoldIcon, I.SunBoldIcon, I.MoonBoldIcon,
  I.MonitorBoldIcon, I.CodeBoldIcon, I.BrushBoldIcon, I.Element3BoldIcon, I.Element4BoldIcon, I.TriangleBoldIcon,
];

/**
 * One brand colour, the whole set follows. The picker is the control; hover a swatch
 * (or the tile steps through them once you point at it) and every icon takes the colour.
 */
export function RecolorArt() {
  const [active, setActive] = useState(0);
  const swatch = swatches[active];

  return (
    <div className={s.art} style={{ "--ink": swatch.hex } as CSSProperties}>
      <div className={s.picker}>
        <div className={s.swatches} role="presentation">
          {swatches.map((c, i) => (
            <i
              key={c.hex}
              style={{ background: c.hex }}
              data-on={i === active || undefined}
              onPointerEnter={() => setActive(i)}
            />
          ))}
        </div>
        <span className={s.hex}>
          <b style={{ background: swatch.hex }} />
          {swatch.hex}
        </span>
      </div>

      <div className={s.grid}>
        {icons.map((Icon, i) => (
          <span key={i} style={{ transitionDelay: `${(i % 6) * 25 + Math.floor(i / 6) * 40}ms` } as CSSProperties}>
            <Icon size={24} />
          </span>
        ))}
      </div>
    </div>
  );
}
