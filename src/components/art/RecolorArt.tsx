import { useEffect, useState, type CSSProperties } from "react";
import * as I from "~/components/icons/Icons";
import { useInView } from "~/hooks/useInView";
import s from "./RecolorArt.module.css";

const swatches = ["#4d8fff", "#ff8d28", "#34c759", "#cb30e0", "#ff383c"];
const icons = [
  I.HomeBoldIcon, I.HeartBoldIcon, I.CameraBoldIcon, I.MusicBoldIcon,
  I.FolderBoldIcon, I.FlashBoldIcon, I.MagicStarBoldIcon, I.StarBoldIcon,
  I.MessageBoldIcon, I.DiamondsBoldIcon, I.SunBoldIcon, I.MoonBoldIcon,
];

/** A whole set takes on one brand colour, cycling through a small palette while visible. */
export function RecolorArt() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!inView || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % swatches.length), 1800);
    return () => window.clearInterval(id);
  }, [inView]);

  return (
    <div ref={ref} className={s.art} style={{ "--ink": swatches[active] } as CSSProperties}>
      <div className={s.palette}>
        {swatches.map((c, i) => (
          <i key={c} style={{ background: c }} data-on={i === active || undefined} />
        ))}
      </div>
      <div className={s.grid}>
        {icons.map((Icon, i) => (
          <span key={i} style={{ transitionDelay: `${i * 30}ms` } as CSSProperties}>
            <Icon size={24} />
          </span>
        ))}
      </div>
    </div>
  );
}
