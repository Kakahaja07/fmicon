import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CopyIcon, DocumentDownloadIcon, TickCircleIcon } from "~/components/icons/Icons";
import { Button } from "~/components/ui/Button";
import { paymentsMeta } from "~/content/payments.meta";
import { stylePath } from "~/lib/iconSeo";
import { DEFAULT_SIZE, DEFAULT_WEIGHT, useToolPrefs } from "./IconBrowser";
import { IconSidebar } from "./IconSidebar";
import { SearchRow } from "./SearchRow";
import browser from "./IconBrowser.module.css";
import grid from "./IconGrid.module.css";
import intro from "./PageIntro.module.css";
import s from "./PaymentLogos.module.css";

export type PaymentSize = (typeof paymentsMeta.sizes)[number]["id"];

const fileOf = (size: PaymentSize, slug: string) => `/payments/${size}/${slug}.svg`;

type PaymentLogosProps = {
  size: PaymentSize;
  query: string;
  onChange: (patch: { size?: PaymentSize; q?: string }) => void;
};

/**
 * /icons/payments: full-colour payment logos in the same workspace as the icons
 * (sidebar · search · grid), so it reads as another set in the library, not a new page.
 */
export function PaymentLogos({ size, query, onChange }: PaymentLogosProps) {
  const navigate = useNavigate();
  const prefs = useToolPrefs();
  const dims = paymentsMeta.sizes.find((x) => x.id === size)!;
  const total = paymentsMeta.logos.length;

  const logos = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = paymentsMeta.logos.filter((l) => !q || l.name.toLowerCase().includes(q) || l.slug.includes(q.replace(/\s+/g, "-")));
    // The list is A–Z already; "popular first" puts the cards people reach for first on top.
    return prefs.sort === "az" ? list : [...list].sort((a, b) => rank(a.slug) - rank(b.slug));
  }, [query, prefs.sort]);

  return (
    <div className={browser.workspace} data-sidebar={prefs.sidebarOpen ? "" : undefined}>
      {prefs.sidebarOpen && (
        <IconSidebar
          style="linear"
          theme="dark"
          size={DEFAULT_SIZE}
          weight={DEFAULT_WEIGHT}
          weightEnabled={false}
          onStyle={(st) => navigate({ to: stylePath(st) })}
          onWeight={() => {}}
          onSize={() => {}}
          onCategory={(cat) => navigate({ to: "/icons", search: { cat } })}
          payments={{ size, onSize: (next) => onChange({ size: next }) }}
        />
      )}

      <div className={browser.center}>
        <header className={intro.intro}>
          <h1 className={intro.h1}>Free Payment Logos</h1>
          <p className={intro.text}>
            {total} payment method logos for checkout pages, in three card sizes. They keep their own colours. Copy one as SVG or download the file. The
            logos belong to their owners, so use them only to show which payments you accept.
          </p>
        </header>

        <SearchRow
          query={query}
          onQuery={(q) => onChange({ q })}
          sidebarOpen={prefs.sidebarOpen}
          onToggleSidebar={prefs.toggleSidebar}
          sort={prefs.sort}
          onSort={prefs.setSort}
          label="Search payment logos"
          placeholder="Search payment logos, e.g. visa, paypal"
        />

        <section className={grid.main} aria-label="Payment logos">
          <p className={grid.summary} aria-live="polite">
            {query ? `${logos.length} of ${total} payment logos` : `${total} payment logos`} · {dims.width}×{dims.height}
          </p>

          {logos.length === 0 ? (
            <div className={grid.state}>
              <p>
                No payment logos match <b>“{query}”</b>. Try another name.
              </p>
              <div className={grid.stateActions}>
                <Button variant="ghost" onClick={() => onChange({ q: "" })}>
                  Clear search
                </Button>
              </div>
            </div>
          ) : (
            <ul className={s.grid} style={{ "--w": `${dims.width * 2}px`, "--h": `${dims.height * 2}px` } as CSSProperties}>
              {logos.map((logo) => (
                <PaymentCard key={logo.slug} slug={logo.slug} name={logo.name} size={size} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

// The cards most checkouts show, in that order; the rest follow A–Z.
const POPULAR = ["visa", "mastercard", "paypal", "applepay", "googlepay", "amex", "stripe", "discover", "shop-pay", "klarna", "alipay", "wechat", "unionpay", "maestro"];
const rank = (slug: string) => {
  const i = POPULAR.indexOf(slug);
  return i === -1 ? POPULAR.length : i;
};

function PaymentCard({ slug, name, size }: { slug: string; name: string; size: PaymentSize }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const src = fileOf(size, slug);

  const copy = async () => {
    try {
      const text = fetch(src).then((r) => r.text());
      // Safari only allows the write inside the click, so hand it the pending file instead of awaiting it first.
      if (typeof ClipboardItem !== "undefined") {
        await navigator.clipboard.write([new ClipboardItem({ "text/plain": text.then((t) => new Blob([t], { type: "text/plain" })) })]);
      } else {
        await navigator.clipboard.writeText(await text);
      }
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* offline or clipboard blocked: the download still works */
    }
  };

  return (
    <li className={s.card}>
      <img className={s.logo} src={src} alt={`${name} logo`} loading="lazy" decoding="async" />
      <span className={s.name}>{name}</span>
      {/* Same joined control as previous / next on icon pages: icons only, names in the tooltip */}
      <div className={s.actions} role="group" aria-label={`${name} logo`}>
        <button type="button" onClick={copy} aria-label={copied ? "Copied" : `Copy ${name} SVG`} title={copied ? "Copied" : "Copy SVG"} data-copied={copied || undefined}>
          {copied ? (
            <span className={s.swap}>
              <TickCircleIcon size={18} />
            </span>
          ) : (
            <CopyIcon size={18} />
          )}
        </button>
        <a href={src} download={`${slug}-${size}.svg`} aria-label={`Download ${name} SVG`} title="Download SVG">
          <DocumentDownloadIcon size={18} />
        </a>
      </div>
    </li>
  );
}
