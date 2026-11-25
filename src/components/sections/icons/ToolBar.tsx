import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { brand, iconTool, openSource } from "~/content/site";
import { GithubLogo } from "~/components/ui/FrameworkLogo";
import { Wordmark } from "~/components/ui/Wordmark";
import { Button } from "~/components/ui/Button";
import { SearchField } from "~/components/ui/SearchField";
import s from "./ToolBar.module.css";

type ToolBarProps = {
  query: string;
  onQuery: (q: string) => void;
  /** Icon pages: line the bar up with the centred page content instead of the window edges */
  contained?: boolean;
};

/** The tool's own slim bar: brand, search and the GitHub repo. Replaces the site header on /icons. */
export function ToolBar({ query, onQuery, contained }: ToolBarProps) {
  const searchRef = useRef<HTMLInputElement>(null);

  // "/" jumps to search from anywhere on the page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && e.target.closest("input, textarea, select");
      if (e.key === "/" && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className={s.bar} data-contained={contained || undefined}>
      <div className={s.brand}>
        <Link to="/" className={s.home} aria-label={iconTool.toolbar.home} title={iconTool.toolbar.home}>
          <Wordmark size={26} />
        </Link>
        <span className={s.count}>v{brand.version}</span>
      </div>

      <div className={s.search}>
        <SearchField
          ref={searchRef}
          label="Search icons"
          placeholder="Search icons, e.g. wallet, arrow, chat"
          value={query}
          onChange={onQuery}
          shortcut="/"
        />
      </div>

      <div className={s.end}>
        <Button href={openSource.repo} target="_blank" rel="noreferrer" icon={GithubLogo} className={s.cta}>
          {iconTool.toolbar.cta}
        </Button>
      </div>
    </header>
  );
}
