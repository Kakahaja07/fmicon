import { useEffect, useState } from "react";

export type ToolTheme = "dark" | "light";

const KEY = "icons-theme";

/**
 * Light/dark for the icon tool only. The rest of the site is dark-only,
 * so leaving the tool puts the page back to dark.
 */
export function useToolTheme() {
  const [theme, setTheme] = useState<ToolTheme | null>(null);

  // Restore the last choice (null until read, so we never overwrite it with the default).
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch {
      /* storage blocked */
    }
    setTheme(saved === "light" ? "light" : "dark");
  }, []);

  useEffect(() => {
    if (!theme) return;
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      /* storage blocked: still applies for this visit */
    }
  }, [theme]);

  useEffect(
    () => () => {
      document.documentElement.dataset.theme = "dark";
    },
    [],
  );

  return [theme ?? "dark", setTheme] as const;
}
