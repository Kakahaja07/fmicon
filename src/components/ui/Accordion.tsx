import { useId, useState, type ReactNode } from "react";
import { AddIcon } from "~/components/icons/Icons";
import s from "./Accordion.module.css";

type AccordionItemProps = {
  question: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

/** One question/answer row. Height animates with a grid-rows trick, so no JS measuring. */
export function AccordionItem({ question, children, defaultOpen = false }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <div className={s.item} data-open={open || undefined}>
      <h3 className={s.heading}>
        <button
          type="button"
          className={s.trigger}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-trigger`}
          onClick={() => setOpen((o) => !o)}
        >
          {question}
          <span className={s.mark} aria-hidden="true">
            <AddIcon size={16} />
          </span>
        </button>
      </h3>
      <div className={s.panel} id={`${id}-panel`} role="region" aria-labelledby={`${id}-trigger`} inert={!open}>
        <div className={s.inner}>
          <p className={s.answer}>{children}</p>
        </div>
      </div>
    </div>
  );
}

export function Accordion({ children }: { children: ReactNode }) {
  return <div className={s.list}>{children}</div>;
}
