import s from "./Switch.module.css";

type SwitchProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
};

/** On/off toggle with its label. */
export function Switch({ label, checked, onChange, disabled }: SwitchProps) {
  return (
    <label className={s.row} data-disabled={disabled || undefined}>
      <span>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={s.switch}
        onClick={() => onChange(!checked)}
      >
        <span className={s.knob} />
      </button>
    </label>
  );
}
