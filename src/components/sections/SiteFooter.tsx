import { footer, story } from "~/content/site";
import { Avatar } from "~/components/ui/Avatar";
import { BrandLogo } from "~/components/ui/BrandLogo";
import { Container } from "~/components/ui/Container";
import s from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <Container as="footer" className={s.footer}>
      <div className={s.grid}>
        <div>
          <BrandLogo />
          <p className={s.tag}>{footer.tagline}</p>
        </div>
        {footer.columns.map((col) => (
          <nav key={col.title} className={s.col} aria-label={col.title}>
            <h3>{col.title}</h3>
            <ul>
              {col.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className={s.base}>
        <p className={s.by}>
          <span className={s.avatars}>
            {story.makers.map((m) => (
              <Avatar key={m.name} initial={m.initial} emoji={m.emoji} colors={m.colors} size="sm" />
            ))}
          </span>
          {footer.madeBy}
        </p>
        <p>{footer.copyright}</p>
      </div>
    </Container>
  );
}
