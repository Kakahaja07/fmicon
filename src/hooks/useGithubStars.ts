import { useEffect, useState } from "react";

const KEY = "fmicon-stars";

/**
 * The repo's live star count from the GitHub API, cached for the visit.
 * Shows `fallback` until it loads, or if GitHub can't be reached (rate limit, offline).
 */
export function useGithubStars(repoUrl: string, fallback = 1) {
  const [stars, setStars] = useState(fallback);

  useEffect(() => {
    let cached: string | null = null;
    try {
      cached = sessionStorage.getItem(KEY);
    } catch {
      /* storage blocked */
    }
    if (cached) return setStars(Number(cached));

    const slug = repoUrl.replace(/^https:\/\/github\.com\//, "");
    const controller = new AbortController();
    fetch(`https://api.github.com/repos/${slug}`, { signal: controller.signal, headers: { Accept: "application/vnd.github+json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (typeof data?.stargazers_count !== "number") return;
        setStars(data.stargazers_count);
        try {
          sessionStorage.setItem(KEY, String(data.stargazers_count));
        } catch {
          /* storage blocked */
        }
      })
      .catch(() => {
        /* keep the fallback */
      });
    return () => controller.abort();
  }, [repoUrl]);

  return stars;
}

/** 1234 -> "1.2k" */
export const formatStars = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n));
