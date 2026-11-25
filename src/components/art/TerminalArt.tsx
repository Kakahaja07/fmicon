import type { CSSProperties } from "react";
import { openSource } from "~/content/site";
import { GithubLogo } from "~/components/ui/FrameworkLogo";
import { useInView } from "~/hooks/useInView";
import s from "./TerminalArt.module.css";

const repo = openSource.repo.replace("https://", "");

/** Open source, shown the way developers meet it: install, then clone. Lines arrive once as the tile scrolls in. */
export function TerminalArt() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={s.art} data-in={inView || undefined}>
      <div className={s.terminal}>
        <div className={s.tab}>
          <GithubLogo size={13} />
          fmicons
          <span className={s.licence}>MIT</span>
        </div>
        <div className={s.lines}>
          <p style={{ "--d": 0 } as CSSProperties}>
            <i>$</i> npm i fmicon-react
          </p>
          <p className={s.out} style={{ "--d": 1 } as CSSProperties}>
            added 1 package in 0.9s
          </p>
          <p style={{ "--d": 2 } as CSSProperties}>
            <i>$</i> git clone {repo}
          </p>
          <p className={s.out} style={{ "--d": 3 } as CSSProperties}>
            Cloning into 'fmicons'... <span className={s.ok}>done</span>
          </p>
          <p style={{ "--d": 4 } as CSSProperties}>
            <i>$</i> <span className={s.cursor} />
          </p>
        </div>
      </div>
    </div>
  );
}
