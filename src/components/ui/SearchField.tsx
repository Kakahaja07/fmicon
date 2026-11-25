import type { InputHTMLAttributes, Ref } from "react";
import { SearchNormalIcon } from "~/components/icons/Icons";
import { Kbd } from "./Kbd";
import s from "./SearchField.module.css";

type SearchFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Optional keyboard hint shown at the right, e.g. "/" */
  shortcut?: string;
  ref?: Ref<HTMLInputElement>;
};

export function SearchField({ label, value, onChange, shortcut, ...rest }: SearchFieldProps) {
  return (
    <label className={s.field}>
      <SearchNormalIcon size={18} className={s.icon} />
      <span className="sr-only">{label}</span>
      <input
        type="search"
        className={s.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        spellCheck={false}
        {...rest}
      />
      {shortcut && !value && (
        <span className={s.hint} aria-hidden="true">
          <Kbd>{shortcut}</Kbd>
        </span>
      )}
    </label>
  );
}
