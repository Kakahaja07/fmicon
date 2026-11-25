import { useEffect, useState } from "react";
import * as I from "~/components/icons/Icons";
import { useInView } from "~/hooks/useInView";
import s from "./StylesArt.module.css";

const grid = [
  I.HomeBoldIcon, I.HeartBoldIcon, I.CameraBoldIcon, I.MusicBoldIcon,
  I.FolderBoldIcon, I.FlashBoldIcon, I.MagicStarBoldIcon, I.StarBoldIcon,
  I.MessageBoldIcon, I.DiamondsBoldIcon, I.SunBoldIcon, I.MoonBoldIcon,
  I.Element4BoldIcon, I.TriangleBoldIcon, I.MonitorBoldIcon, I.Element3BoldIcon,
];

const styles = [
  { label: "Linear", icon: I.HeartIcon },
  { label: "Bold", icon: I.HeartBoldIcon },
  { label: "Twotone", icon: I.HeartTwotoneIcon },
];

/** Icon grid plus a big preview that cycles through styles while visible. */
export function StylesArt() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!inView || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % styles.length), 1600);
    return () => window.clearInterval(id);
  }, [inView]);

  const Current = styles[index].icon;

  return (
    <div className={s.panel} ref={ref}>
      <div className={s.mini}>
        {grid.map((Icon, i) => (
          <i key={i}>
            <Icon size={18} />
          </i>
        ))}
      </div>
      <div className={s.big}>
        <Current key={index} size={72} className={s.preview} />
        <div className={s.pills}>
          {styles.map((st, i) => (
            <span key={st.label} data-on={i === index || undefined}>
              {st.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
