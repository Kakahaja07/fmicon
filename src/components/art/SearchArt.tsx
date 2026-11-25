import * as I from "~/components/icons/Icons";
import s from "./SearchArt.module.css";

const results = [
  { icon: I.WalletIcon, name: "Wallet" },
  { icon: I.CardIcon, name: "Card" },
  { icon: I.MoneyIcon, name: "Money" },
  { icon: I.WalletAddIcon, name: "Wallet add" },
];

/** Typing "money" finds wallets, cards and cash: the search field and its results, cut by the tile's foot. */
export function SearchArt({ query }: { query: string }) {
  return (
    <div className={s.art}>
      <div className={s.panel}>
        <div className={s.field}>
          <I.SearchNormalIcon size={18} />
          <span className={s.typed}>{query}</span>
          <span className={s.caret} />
        </div>
        <ul className={s.results}>
          {results.map(({ icon: Icon, name }, i) => (
            <li key={name} data-selected={i === 0 || undefined}>
              <span className={s.glyph}>
                <Icon size={20} />
              </span>
              {name}
              {i === 0 && <kbd>↵</kbd>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
