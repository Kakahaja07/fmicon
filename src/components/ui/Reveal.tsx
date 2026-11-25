import type { CSSProperties, ElementType, ReactNode } from "react";
import { useInView } from "~/hooks/useInView";

type RevealProps = {
  as?: ElementType;
  delay?: number;
  className?: string;
  children: ReactNode;
};

/** Fades and lifts its children in the first time they scroll into view. */
export function Reveal({ as: Tag = "div", delay = 0, className, children }: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>();
  return (
    <Tag
      ref={ref}
      className={className}
      data-reveal=""
      data-visible={inView ? "" : undefined}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
