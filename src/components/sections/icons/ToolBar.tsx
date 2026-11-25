import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { iconTool, openSource } from "~/content/site";
import { GithubLogo } from "~/components/ui/FrameworkLogo";
import { freeIconsMeta } from "~/content/freeIcons.meta";
import { MoonBoldIcon, MoonIcon, SunBoldIcon, SunIcon } from "~/components/icons/Icons";
import { AppIcon } from "~/components/ui/AppIcon";
import { Button } from "~/components/ui/Button";
import { SearchField } from "~/components/ui/SearchField";
import { Segmented } from "~/components/ui/Segmented";
import type { ToolTheme } from "~/hooks/useToolTheme";
import s from "./ToolBar.module.css";

type ToolBarProps = {
  query: string;
  onQuery: (q: string) => void;
  theme: ToolTheme;
  onTheme: (theme: ToolTheme) => void;
  /** Icon pages: line the bar up with the centred page content instead of the window edges */
  contained?: boolean;
};

// Linear when idle, bold when selected.
const themeOptions = (theme: ToolTheme) => [
  { value: "light" as const, title: "Light mode", label: theme === "light" ? <SunBoldIcon size={16} /> : <SunIcon size={16} /> },
  { value: "dark" as const, title: "Dark mode", label: theme === "dark" ? <MoonBoldIcon size={16} /> : <MoonIcon size={16} /> },
];

/** The tool's own slim bar: brand, search, theme and the GitHub repo. Replaces the site header on /icons. */
export function ToolBar({ query, onQuery, theme, onTheme, contained }: ToolBarProps) {
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
          <AppIcon size={26} />
        </Link>
        <p className={s.title}>
          {iconTool.toolbar.title}
          <span className={s.count}>{freeIconsMeta.total}</span>
        </p>
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
        <Segmented label="Colour theme" value={theme} options={themeOptions(theme)} onChange={onTheme} size="sm" className={s.theme} />
        <Button href={openSource.repo} target="_blank" rel="noreferrer" icon={GithubLogo} className={s.cta}>
          {iconTool.toolbar.cta}
        </Button>
      </div>
    </header>
  );
}
