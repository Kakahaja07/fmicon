import { AddIcon, MinusIcon } from "~/components/icons/Icons";
import s from "./QuantityStepper.module.css";

type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label: string;
};

export function QuantityStepper({ value, onChange, min = 1, max = 99, label }: QuantityStepperProps) {
  const set = (next: number) => onChange(Math.min(max, Math.max(min, next)));

  return (
    <div className={s.stepper} role="group" aria-label={label}>
      <button type="button" className={s.step} onClick={() => set(value - 1)} disabled={value <= min} aria-label="One fewer">
        <MinusIcon size={16} />
      </button>
      <output className={s.value} aria-live="polite">
        {value}
      </output>
      <button type="button" className={s.step} onClick={() => set(value + 1)} disabled={value >= max} aria-label="One more">
        <AddIcon size={16} />
      </button>
    </div>
  );
}
