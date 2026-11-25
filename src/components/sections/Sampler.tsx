import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRightIcon } from "~/components/icons/Icons";
import { sampler } from "~/content/site";
import { Container } from "~/components/ui/Container";
import { SvgIcon } from "~/components/ui/SvgIcon";
import { useInView } from "~/hooks/useInView";
import { loadPreview } from "~/hooks/useIconStyle";
import { iconPath } from "~/lib/iconSeo";
import { humanName, styleLabels, type FreeIcon, type IconStyle } from "~/lib/svg";
import s from "./Sampler.module.css";

type Hover = { name: string; style: IconStyle } | null;

/**
 * The same icons in four styles, side by side. Point at any icon to see its name;
 * click to open its page in the free browser. Icons load when the section comes into view.
 */
export function Sampler() {
  const { ref, inView } = useInView<HTMLElement>("0px 0px 400px 0px");
  const [sets, setSets] = useState<Partial<Record<IconStyle, FreeIcon[]>>>({});
  const [hover, setHover] = useState<Hover>(null);

  useEffect(() => {
    if (!inView) return;
    let live = true;
    for (const style of sampler.styles) {
      loadPreview(style).then((icons) => live && setSets((prev) => ({ ...prev, [style]: icons.slice(0, sampler.count) })));
    }
    return () => {
      live = false;
    };
  }, [inView]);

  return (
    <section ref={ref} className={s.section} aria-labelledby="sampler-title">
      <Container>
        <div className={s.head}>
          <div>
            <h2 id="sampler-title" className={s.title}>
              {sampler.title}
            </h2>
            <p className={s.sub}>{sampler.sub}</p>
          </div>
          {/* Name of whatever you point at, like a caption */}
          <p className={s.caption} aria-live="polite">
            {hover ? (
              <>
                {humanName(hover.name)} <span>{styleLabels[hover.style]}</span>
              </>
            ) : (
              <span>{sampler.hint}</span>
            )}
          </p>
        </div>

        <div className={s.columns} onMouseLeave={() => setHover(null)}>
          {sampler.styles.map((style) => {
            const icons = sets[style];
            return (
              <figure key={style} className={s.column}>
                <figcaption className={s.cardHead}>
                  <span>
                    <b className={s.styleName}>{styleLabels[style]}</b>
                    <span className={s.trait}>{sampler.traits[style]}</span>
                  </span>
                  <Link to={style === "linear" ? "/icons" : "/icons/$style"} params={style === "linear" ? undefined : { style }} className={s.viewAll}>
                    {sampler.viewAll}
                    <ArrowRightIcon size={14} />
                  </Link>
                </figcaption>
                <div className={s.grid}>
                  {icons
                    ? icons.map((icon) => (
                        <a
                          key={icon.id}
                          href={iconPath(style, icon.slug)}
                          className={s.cell}
                          aria-label={`${humanName(icon.name)}, ${styleLabels[style]}`}
                          onMouseEnter={() => setHover({ name: icon.name, style })}
                          onFocus={() => setHover({ name: icon.name, style })}
                        >
                          <SvgIcon body={icon.body} size={22} />
                        </a>
                      ))
                    : Array.from({ length: sampler.count }, (_, i) => <span key={i} className={s.placeholder} />)}
                </div>
              </figure>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
