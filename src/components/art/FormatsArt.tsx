import { HeartIcon } from "~/components/icons/Icons";
import { cdnPngUrl } from "~/lib/packages";
import s from "./FormatsArt.module.css";

const files = [
  { ext: "PNG", name: "heart.png", size: "2.4 KB" },
  { ext: "JSX", name: "Heart.jsx", size: "0.9 KB" },
  { ext: "SVG", name: "heart.svg", size: "0.6 KB" },
];

/**
 * One icon leaving as three files: a loose fan of file cards. Each shows its own format:
 * the PNG a rendered glass heart, the JSX a line of code, and the SVG in front the vector itself,
 * selected, with its handles.
 */
export function FormatsArt() {
  return (
    <div className={s.art}>
      <div className={s.fan}>
        {files.map((f, i) => (
          <figure key={f.ext} className={s.file} data-i={i}>
            <span className={s.badge}>{f.ext}</span>
            <span className={s.preview}>
              {f.ext === "PNG" && <img src={cdnPngUrl("glass", "heart")} alt="" width={40} height={40} loading="lazy" />}
              {f.ext === "JSX" && <code className={s.jsx}>{"<Heart />"}</code>}
              {f.ext === "SVG" && (
                <span className={s.vector}>
                  <HeartIcon size={52} />
                  <i aria-hidden="true" />
                  <i aria-hidden="true" />
                  <i aria-hidden="true" />
                  <i aria-hidden="true" />
                </span>
              )}
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
