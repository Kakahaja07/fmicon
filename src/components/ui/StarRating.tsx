import { StarBoldIcon } from "~/components/icons/Icons";
import s from "./StarRating.module.css";

type StarRatingProps = { value: number; label: string };

export function StarRating({ value, label }: StarRatingProps) {
  return (
    <p className={s.rating}>
      <span className={s.stars} aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <StarBoldIcon key={i} size={16} />
        ))}
      </span>
      <span>
        <span className="sr-only">{value} out of 5 stars. </span>
        {label}
      </span>
    </p>
  );
}
