import type { ReactNode } from "react";
import { CopyIcon, TickCircleIcon } from "~/components/icons/Icons";
import { cx } from "~/lib/cx";
import s from "./CodeBlock.module.css";

type CodeBlockProps = {
  /** Shown in the header, e.g. "HomeIcon.tsx" */
  filename: string;
  /** What is displayed (may be shortened for reading) */
  code: string;
  onCopy: () => void;
  copied?: boolean;
  /** Optional control in the header, e.g. a React / SVG switch */
  extra?: ReactNode;
  className?: string;
};

// Minimal JSX/SVG highlighter: comments, strings, keywords, tag names, attribute names, braces.
const TOKEN =
  /(\/\/[^\n]*)|("[^"\n]*")|\b(export|const|return|import|from)\b|(<\/?)([A-Za-z][\w.]*)|([A-Za-z_:][\w:-]*)(?==)|(=>|[{}()])/g;

function highlight(line: string) {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of line.matchAll(TOKEN)) {
    const i = m.index ?? 0;
    if (i > last) out.push(line.slice(last, i));
    const [, comment, str, keyword, open, tag, attr, punct] = m;
    if (comment) out.push(<span key={key++} className={s.comment}>{comment}</span>);
    else if (str) out.push(<span key={key++} className={s.string}>{str}</span>);
    else if (keyword) out.push(<span key={key++} className={s.keyword}>{keyword}</span>);
    else if (tag) {
      out.push(<span key={key++} className={s.punct}>{open}</span>);
      out.push(<span key={key++} className={s.tag}>{tag}</span>);
    } else if (attr) out.push(<span key={key++} className={s.attr}>{attr}</span>);
    else if (punct) out.push(<span key={key++} className={s.punct}>{punct}</span>);
    last = i + m[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

/** Read-only code view: file header with copy, line numbers, wrapped lines, light syntax colours. */
export function CodeBlock({ filename, code, onCopy, copied, extra, className }: CodeBlockProps) {
  const lines = code.replace(/\n$/, "").split("\n");

  return (
    <div className={cx(s.block, className)}>
      <div className={s.header}>
        <span className={s.file}>{filename}</span>
        <span className={s.headerEnd}>
          {extra}
          <button type="button" className={s.copy} onClick={onCopy} data-copied={copied || undefined}>
            {copied ? <TickCircleIcon size={14} /> : <CopyIcon size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </span>
      </div>
      <pre className={s.body}>
        <code>
          {lines.map((line, i) => (
            <span key={i} className={s.line}>
              {highlight(line)}
              {"\n"}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
