import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { brand, footer, openSource, story } from "~/content/site";
import { Avatar } from "~/components/ui/Avatar";
import { CommandLine } from "~/components/ui/CommandLine";
import { Container } from "~/components/ui/Container";
import { GithubLogo } from "~/components/ui/FrameworkLogo";
import { Wordmark } from "~/components/ui/Wordmark";
import s from "./SiteFooter.module.css";

/**
 * Brand, install command and GitHub on the left; Icons, Docs and Open source links on the right;
 * maker and licence in a slim bottom row.
 */
export function SiteFooter() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText(footer.install);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked: the command is still selectable */
    }
  };

  return (
    <footer className={s.footer}>
      <Container>
        <div className={s.top}>
          <div className={s.brand}>
            <Link to="/" className={s.logo} aria-label={`${brand.name} home`}>
              <Wordmark size={30} />
            </Link>
            <p className={s.tag}>{footer.tagline}</p>
            <div className={s.installRow}>
              <CommandLine command={footer.install} onCopy={copyInstall} copied={copied} className={s.install} />
              <a href={openSource.repo} target="_blank" rel="noreferrer" className={s.star} aria-label={openSource.star.label} title={openSource.star.label}>
                <GithubLogo size={18} />
              </a>
            </div>
          </div>

          <div className={s.columns}>
            {footer.columns.map((col) => (
              <nav key={col.title} className={s.col} aria-label={col.title}>
                <h3>{col.title}</h3>
                <ul>
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {"external" in link && link.external ? (
                        <a href={link.href} target="_blank" rel="noreferrer">
                          {link.label}
                        </a>
                      ) : (
                        <a href={link.href}>{link.label}</a>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className={s.base}>
          <p className={s.by}>
            {story.makers.map((m) => (
              <Avatar key={m.name} initial={m.initial} emoji={m.emoji} image={m.image} colors={m.colors} size="md" />
            ))}
            {footer.madeBy}
          </p>
          <p className={s.copy}>
            {footer.copyright}
          </p>
        </div>
      </Container>
    </footer>
  );
}
