import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { brand, nav } from "~/content/site";
import { AppIcon } from "~/components/ui/AppIcon";
import { Wordmark } from "~/components/ui/Wordmark";
import { Button } from "~/components/ui/Button";
import { GithubLogo } from "~/components/ui/FrameworkLogo";
import { useActiveSection } from "~/hooks/useActiveSection";
import { useScrolled } from "~/hooks/useScrolled";
import { cx } from "~/lib/cx";
import s from "./SiteHeader.module.css";

const sectionIds = nav.links.filter((l) => !l.page).map((l) => l.id);

type Pill = { x: number; w: number };

export function SiteHeader() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const section = useActiveSection(sectionIds);
  // On a page of its own (e.g. /icons) that link is current; on home, the section in view is.
  const pageLink = nav.links.find((l) => l.page && pathname.startsWith(l.href));
  const active = pageLink ? pageLink.id : pathname === "/" ? section : "";
  const scrolled = useScrolled();
  // Docs get a full-width bar (lined up with the docs columns) instead of the floating pill
  const bar = pathname.startsWith("/docs");
  const [hovered, setHovered] = useState<string | null>(null);
  const [pill, setPill] = useState<Pill | null>(null);
  const [ready, setReady] = useState(false);
  const linkRefs = useRef(new Map<string, HTMLAnchorElement>());

  // The pill sits under the hovered link, or rests on the current section.
  const target = hovered ?? active;

  const measure = useCallback(() => {
    const el = linkRefs.current.get(target);
    if (!el || el.offsetParent === null) return setPill(null);
    setPill({ x: el.offsetLeft, w: el.offsetWidth });
  }, [target]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Skip the slide on first paint so the pill doesn't fly in from the left.
  useEffect(() => {
    if (pill && !ready) requestAnimationFrame(() => setReady(true));
  }, [pill, ready]);

  return (
    <header className={s.header} data-variant={bar ? "bar" : undefined} data-scrolled={scrolled || undefined}>
      <nav className={s.nav} aria-label="Primary" data-scrolled={scrolled || undefined}>
        <a className={s.logo} href="/" aria-label={`${brand.name} home`}>
          {bar ? <Wordmark size={28} /> : <AppIcon size={28} />}
          {/* Three pencil strokes, drawn in on hover */}
          <svg className={s.strokes} viewBox="0 0 12 18" aria-hidden="true">
            <path pathLength={1} d="M1.5 3.5C4 1.6 6.6 5 10.5 2.6" />
            <path pathLength={1} d="M1 9.2C3.6 7.4 6.4 10.8 10.8 8.4" />
            <path pathLength={1} d="M1.5 15C4 13.2 6.8 16.4 10.5 14.2" />
          </svg>
        </a>

        <div className={s.links} onMouseLeave={() => setHovered(null)}>
          <span
            className={s.pill}
            aria-hidden="true"
            data-ready={ready || undefined}
            data-hidden={!pill || undefined}
            style={pill ? ({ "--x": `${pill.x}px`, "--w": `${pill.w}px` } as CSSProperties) : undefined}
          />
          {nav.links.map((link) => {
            const props = {
              ref: (el: HTMLAnchorElement | null) => {
                if (el) linkRefs.current.set(link.id, el);
                else linkRefs.current.delete(link.id);
              },
              className: cx(s.link, link.optional && s.optional),
              "aria-current": active === link.id ? (link.page ? ("page" as const) : ("location" as const)) : undefined,
              "data-target": target === link.id || undefined,
              onMouseEnter: () => setHovered(link.id),
              onFocus: () => setHovered(link.id),
              onBlur: () => setHovered(null),
              children: link.label,
            };
            // Pages use the router (instant, preloaded on hover); home sections are plain hash links.
            return link.page ? <Link key={link.id} to={link.href} {...props} /> : <a key={link.id} href={link.href} {...props} />;
          })}
        </div>

        <span className={s.divider} aria-hidden="true" />

        <Button href={nav.cta.href} target="_blank" rel="noreferrer" className={s.cta} icon={GithubLogo}>
          {nav.cta.label}
        </Button>
      </nav>
    </header>
  );
}
