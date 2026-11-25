import { useEffect, useRef, useState } from "react";
import { mcpClients, mcpPage, type McpClient } from "~/content/mcp";
import { ArrowRightIcon, CodeIcon, CommandIcon, CopyIcon, TickCircleIcon } from "~/components/icons/Icons";
import { AiLogo, aiTools } from "~/components/ui/AiLogo";
import { cx } from "~/lib/cx";
import s from "./Mcp.module.css";

function ClientLogo({ logo, size = 22 }: { logo: McpClient["logo"]; size?: number }) {
  if (logo === "codex") return <CommandIcon size={size} />;
  if (logo === "other") return <CodeIcon size={size} />;
  const tool = aiTools.find((t) => t.id === logo);
  return tool ? <AiLogo tool={tool} size={size} /> : null;
}

/** Copy button with a short "Copied" state. */
function useCopy() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked: the code is still selectable */
    }
  };
  return { copied, copy };
}

/**
 * The AI apps as tiles (like an app store row); picking one shows its setup right below:
 * a one-click install where the app has one, the steps, and the command or config to copy.
 */
export function McpClients() {
  const [active, setActive] = useState(mcpClients[0].id);
  const client = mcpClients.find((c) => c.id === active) ?? mcpClients[0];
  const { copied, copy } = useCopy();
  const manual = useCopy();

  return (
    <div className={s.clients}>
      <div className={s.tiles} role="tablist" aria-label="Choose your AI app">
        {mcpClients.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={c.id === active}
            aria-controls="mcp-setup"
            className={cx(s.tile, c.id === active && s.tileOn)}
            onClick={() => setActive(c.id)}
          >
            <span className={s.tileLogo}>
              <ClientLogo logo={c.logo} />
            </span>
            <span className={s.tileName}>{c.label}</span>
            <span className={s.tileAction}>
              {c.install ? c.install.label : "Set up"}
              <ArrowRightIcon size={12} />
            </span>
          </button>
        ))}
      </div>

      <div id="mcp-setup" role="tabpanel" className={s.setup} key={client.id}>
        <div className={s.setupHead}>
          <span className={s.setupLogo}>
            <ClientLogo logo={client.logo} size={18} />
          </span>
          <h3 className={s.setupTitle}>Set up in {client.label}</h3>
          {client.install && (
            <a className={s.installBtn} href={client.install.href}>
              {client.install.label}
            </a>
          )}
        </div>
        <ol className={s.steps}>
          {client.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <div className={s.code}>
          <pre>
            <code>{client.code.text}</code>
          </pre>
          <button type="button" className={s.copy} onClick={() => copy(client.code.text)} aria-label="Copy">
            {copied ? <TickCircleIcon size={16} /> : <CopyIcon size={16} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <p className={s.manual}>
        {mcpPage.manual}
        <button type="button" className={s.manualCmd} onClick={() => manual.copy("npx -y fmicon-mcp")}>
          <code>npx -y fmicon-mcp</code>
          {manual.copied ? <TickCircleIcon size={14} /> : <CopyIcon size={14} />}
        </button>
      </p>
    </div>
  );
}
