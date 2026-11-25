import type { CSSProperties } from "react";
import { cx } from "~/lib/cx";
import s from "./Slider.module.css";

type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  /** Text shown right of the label, e.g. "128 px" */
  valueText?: string;
  className?: string;
};

/** Native range input with a filled track, so it works with keyboard and screen readers everywhere. */
export function Slider({ label, value, min, max, step = 1, onChange, valueText, className }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label className={cx(s.slider, className)}>
      <span className={s.head}>
        <span>{label}</span>
        {valueText && <span className={s.value}>{valueText}</span>}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--pct": `${pct}%` } as CSSProperties}
      />
    </label>
  );
}
