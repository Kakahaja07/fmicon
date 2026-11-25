import { useId, type InputHTMLAttributes } from "react";
import { cx } from "~/lib/cx";
import s from "./TextField.module.css";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  /** Keep the label for screen readers only */
  hideLabel?: boolean;
  error?: string;
};

export function TextField({ label, hideLabel, error, className, id, ...rest }: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;

  return (
    <div className={cx(s.field, className)}>
      <label htmlFor={inputId} className={hideLabel ? "sr-only" : s.label}>
        {label}
      </label>
      <input
        id={inputId}
        className={s.input}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />
      {error && (
        <p id={errorId} className={s.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
