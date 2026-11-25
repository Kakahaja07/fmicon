import type { CSSProperties } from "react";
import s from "./ColorSwatches.module.css";

export type Swatch = { value: string; label: string; /** CSS colour to paint the dot with */ paint: string };

type ColorSwatchesProps = {
  label: string;
  swatches: Swatch[];
  value: string;
  onChange: (value: string) => void;
  /** Adds a native colour picker at the end */
  allowCustom?: boolean;
};

export function ColorSwatches({ label, swatches, value, onChange, allowCustom = true }: ColorSwatchesProps) {
  const isCustom = !swatches.some((sw) => sw.value === value);
  return (
    <div className={s.row} role="radiogroup" aria-label={label}>
      {swatches.map((sw) => (
        <button
          key={sw.value}
          type="button"
          role="radio"
          aria-checked={sw.value === value}
          aria-label={sw.label}
          title={sw.label}
          className={s.dot}
          style={{ "--dot": sw.paint } as CSSProperties}
          onClick={() => onChange(sw.value)}
        />
      ))}
      {allowCustom && (
        <label className={s.custom} title="Custom colour" data-on={isCustom || undefined}>
          <span className="sr-only">Custom colour</span>
          <input
            type="color"
            value={isCustom && value.startsWith("#") ? value : "#4d8fff"}
            onChange={(e) => onChange(e.target.value)}
          />
        </label>
      )}
    </div>
  );
}
