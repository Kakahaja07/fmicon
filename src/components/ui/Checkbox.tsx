import type { ReactNode } from "react";
import s from "./Checkbox.module.css";

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  hint?: string;
};

export function Checkbox({ checked, onChange, children, hint }: CheckboxProps) {
  return (
    <label className={s.check}>
      <input type="checkbox" className={s.box} checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>
        {children}
        {hint && <small className={s.hint}>{hint}</small>}
      </span>
    </label>
  );
}

/** Soft grouped list for several checkboxes. */
export function CheckboxGroup({ children }: { children: ReactNode }) {
  return <div className={s.group}>{children}</div>;
}
