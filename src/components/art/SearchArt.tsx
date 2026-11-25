import * as I from "~/components/icons/Icons";
import s from "./SearchArt.module.css";

const results = [I.WalletIcon, I.CardIcon, I.MoneyIcon, I.WalletAddIcon, I.BagIcon];

/** Typing "money" finds wallets, cards and coins: search by meaning, not just file names. */
export function SearchArt({ query, tags }: { query: string; tags: string[] }) {
  return (
    <div className={s.art}>
      <div className={s.field}>
        <I.SearchNormalIcon size={18} />
        <span className={s.typed}>{query}</span>
        <span className={s.caret} />
      </div>
      <div className={s.results}>
        {results.map((Icon, i) => (
          <span key={i} data-first={i === 0 || undefined}>
            <Icon size={22} />
          </span>
        ))}
      </div>
      <div className={s.tags}>
        {tags.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </div>
  );
}
