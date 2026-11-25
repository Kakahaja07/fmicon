import { HeartBoldIcon } from "~/components/icons/Icons";
import s from "./FormatsArt.module.css";

const files = [
  { ext: "PNG", name: "heart.png", size: "2.4 KB" },
  { ext: "JSX", name: "Heart.jsx", size: "0.9 KB" },
  { ext: "SVG", name: "heart.svg", size: "0.6 KB" },
];

/** One icon leaving as three files: a loose fan of file cards, the front one named. */
export function FormatsArt() {
  return (
    <div className={s.art}>
      <div className={s.fan}>
        {files.map((f, i) => (
          <figure key={f.ext} className={s.file} data-i={i}>
            <span className={s.badge}>{f.ext}</span>
            <span className={s.preview}>
              <HeartBoldIcon size={44} />
            </span>
            <figcaption>
              <b>{f.name}</b>
              <span>{f.size}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
