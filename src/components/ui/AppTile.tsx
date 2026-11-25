import type { ReactNode } from "react";
import { CodeIcon } from "~/components/icons/Icons";
import { AiLogo, aiTools } from "~/components/ui/AiLogo";
import { cx } from "~/lib/cx";
import s from "./AppTile.module.css";

/** Real app icons in public/apps (128 px). */
const IMAGES = {
  claude: "Claude",
  "claude-code": "Claude Code",
  codex: "Codex",
  vscode: "VS Code",
  windsurf: "Windsurf",
  kiro: "Kiro",
  antigravity: "Antigravity",
  opencode: "OpenCode",
  warp: "Warp",
  notion: "Notion",
  framer: "Framer",
  grok: "Grok",
  muse: "Muse",
} as const;

export type AppId = keyof typeof IMAGES | "cursor" | "other";

/** An AI app as its real app icon, or a matching dark tile with its logo when we have no image. */
export function AppTile({ app, size = 36, className }: { app: AppId; size?: number; className?: string }) {
  if (app in IMAGES) {
    const label = IMAGES[app as keyof typeof IMAGES];
    return <img className={cx(s.img, className)} src={`/apps/${app}.png`} alt={label} width={size} height={size} loading="lazy" decoding="async" />;
  }
  let mark: ReactNode = <CodeIcon size={Math.round(size * 0.5)} />;
  if (app === "cursor") {
    const tool = aiTools.find((t) => t.id === "cursor");
    if (tool) mark = <AiLogo tool={tool} size={Math.round(size * 0.52)} />;
  }
  return (
    <span className={cx(s.tile, className)} style={{ width: size, height: size }} role="img" aria-label={app === "cursor" ? "Cursor" : "Any MCP app"}>
      {mark}
    </span>
  );
}
