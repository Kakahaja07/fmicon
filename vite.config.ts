import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";

// Every icon page (/icons/<style>/<slug>) and style page, written by `npm run free-icons`.
const iconPages: string[] = JSON.parse(readFileSync("src/content/free-icons/pages.json", "utf8"));

// Production address, used for the sitemap. Keep in step with brand.siteUrl in src/content/site.ts.
const docPaths = ["vanilla", "react", "react-native", "vue", "svelte", "angular", "flutter", "svg"].map((id) => `/docs/${id}`);
const SITE_URL = "https://fmicon.dev";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    tanstackStart({
      // Prerender every page to static HTML at build time: fast first paint, good SEO, any static host.
      pages: [{ path: "/" }, { path: "/docs" }, ...docPaths.map((path) => ({ path })), ...iconPages.map((path) => ({ path }))],
      prerender: {
        enabled: true,
        crawlLinks: true,
        // "/#pricing" and "/icons?q=home" are existing pages with a hash or filter, not pages of their own.
        filter: (page) => !page.path.includes("#") && !page.path.includes("?"),
      },
      sitemap: { enabled: true, host: SITE_URL },
    }),
    viteReact(),
  ],
});
