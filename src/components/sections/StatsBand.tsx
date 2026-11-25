import { stats } from "~/content/site";
import s from "./StatsBand.module.css";

/** Real numbers from the icon set, instead of a wall of logos. */
export function StatsBand() {
  return (
    <dl className={s.band}>
      {stats.map((item) => (
        <div key={item.label} className={s.stat}>
          <dt className={s.value}>{item.value}</dt>
          <dd className={s.label}>{item.label}</dd>
        </div>
      ))}
    </dl>
  );
}
