import { useCallback, useEffect, useState } from "react";
import type { FreeIcon, IconStyle } from "~/lib/svg";

// Each style's JSON is its own lazy chunk: loaded on demand in the browser,
// and importable at build time so icon pages can be prerendered with the real SVG.
const files = import.meta.glob<{ icons: FreeIcon[] }>("../content/free-icons/*.json", { import: "default" });

const cache = new Map<string, Promise<FreeIcon[]>>();

/** Glass has baked-in shading, so it ships a separate light-tone file. */
const fileFor = (style: IconStyle, tone: "dark" | "light") => (style === "glass" && tone === "light" ? "glass-light" : style);

/** All free icons of one style (cached per visit). */
export function loadIcons(style: IconStyle, tone: "dark" | "light" = "dark") {
  const file = fileFor(style, tone);
  let request = cache.get(file);
  if (!request) {
    const loader = files[`../content/free-icons/${file}.json`];
    request = loader ? loader().then((d) => d.icons) : Promise.reject(new Error(`Unknown style: ${style}`));
    request.catch(() => cache.delete(file));
    cache.set(file, request);
  }
  return request;
}

/** The first 40 icons of a style: a small file for the home page previews. */
export function loadPreview(style: IconStyle, tone: "dark" | "light" = "dark") {
  const file = `preview-${fileFor(style, tone)}`;
  let request = cache.get(file);
  if (!request) {
    const loader = files[`../content/free-icons/${file}.json`];
    request = loader ? loader().then((d) => d.icons) : Promise.reject(new Error(`Unknown style: ${style}`));
    request.catch(() => cache.delete(file));
    cache.set(file, request);
  }
  return request;
}

type State ={ status: "loading" } | { status: "error" } | { status: "ready"; icons: FreeIcon[] };

/** Loads the free icon sample for one style. Keeps showing the previous style while the next loads. */
export function useIconStyle(style: IconStyle, tone: "dark" | "light" = "dark") {
  const [state, setState] = useState<State>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let live = true;
    loadIcons(style, tone).then(
      (icons) => live && setState({ status: "ready", icons }),
      () => live && setState({ status: "error" }),
    );
    return () => {
      live = false;
    };
  }, [style, tone, attempt]);

  const retry = useCallback(() => {
    setState({ status: "loading" });
    setAttempt((n) => n + 1);
  }, []);

  return { ...state, retry };
}
