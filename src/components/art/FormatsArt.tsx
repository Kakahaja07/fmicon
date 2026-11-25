import { HeartBoldIcon } from "~/components/icons/Icons";
import s from "./FormatsArt.module.css";

/** One icon in the middle, every format it can leave as around it. */
export function FormatsArt({ formats }: { formats: string[] }) {
  const half = Math.ceil(formats.length / 2);
  return (
    <div className={s.art}>
      <div className={s.row}>
        {formats.slice(0, half).map((f) => (
          <span key={f}>{f}</span>
        ))}
      </div>
      <span className={s.tile}>
        <HeartBoldIcon size={40} />
      </span>
      <div className={s.row}>
        {formats.slice(half).map((f) => (
          <span key={f}>{f}</span>
        ))}
      </div>
    </div>
  );
}
