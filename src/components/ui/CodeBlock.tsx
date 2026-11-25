import { useEffect, useRef, useState, type ReactNode } from "react";
import { CopyIcon, TickCircleIcon } from "~/components/icons/Icons";
import { cx } from "~/lib/cx";
import s from "./CodeBlock.module.css";

type CodeBlockProps = {
  /** Shown in the header, e.g. "HomeIcon.tsx" or "HTML (CDN)" */
  filename: string;
  /** What is displayed (may be shortened for reading) */
  code: string;
  onCopy: () => void;
  copied?: boolean;
  /** Optional control in the header, e.g. a React / SVG switch */
  extra?: ReactNode;
  /** Line numbers in the gutter (off by default) */
  lineNumbers?: boolean;
  className?: string;
};

// Minimal JSX/HTML/JS highlighter: comments, strings, keywords, tag names, attribute names, braces.
// "//" only starts a comment when it is not part of a URL (https://…).
const TOKEN =
  /((?<![:\w])\/\/[^\n]*|#[^\n]*(?=$))|("[^"\n]*"|'[^'\n]*'|`[^`\n]*`)|\b(export|const|let|return|import|from|function|default|await|async|npm|npx|install)\b|(<\/?)([A-Za-z][\w.-]*)|([A-Za-z_:@][\w:-]*)(?==)|(=>|[{}()])/g;

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

/**
 * Read-only code view used everywhere on the site: a soft card with a label and a copy button
 * in the top-right corner, and the code on a darker inset panel with light syntax colours.
 */
export function CodeBlock({ filename, code, onCopy, copied, extra, lineNumbers = false, className }: CodeBlockProps) {
  const lines = code.replace(/\n$/, "").split("\n");

  return (
    <div className={cx(s.block, className)}>
      <div className={s.header}>
        <span className={s.file}>{filename}</span>
        <span className={s.headerEnd}>
          {extra}
          <button
            type="button"
            className={s.copy}
            onClick={onCopy}
            data-copied={copied || undefined}
            aria-label={copied ? "Copied" : `Copy ${filename}`}
            title={copied ? "Copied" : "Copy"}
          >
            {copied ? <TickCircleIcon size={16} /> : <CopyIcon size={16} />}
          </button>
        </span>
      </div>
      <pre className={s.body} data-numbers={lineNumbers || undefined}>
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

/** A CodeBlock that copies its own code and shows a tick for a moment. */
export function CopyCode({ filename, code, className }: { filename: string; code: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked: the code is still selectable */
    }
  };
  return <CodeBlock filename={filename} code={code} onCopy={copy} copied={copied} className={className} />;
}
