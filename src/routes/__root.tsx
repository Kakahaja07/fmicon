import type { ReactNode } from "react";
import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import { brand } from "~/content/site";
import globalCss from "~/styles/global.css?url";
import alloFont from "allo-font/fonts/webfonts/AlloVariableFriendly.woff2?url";

const title = `${brand.name}: 891 Free Icons in 8 Styles (SVG, PNG & React)`;

/** Marks <html> with "js" so scroll reveals only hide content when JS runs. */
const jsFlagScript = `document.documentElement.classList.add("js")`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title },
      { name: "description", content: brand.description },
      { name: "color-scheme", content: "dark" },
      { name: "theme-color", content: "#161617" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: title },
      { property: "og:description", content: brand.description },
      { property: "og:url", content: brand.siteUrl },
      { property: "og:image", content: `${brand.siteUrl}/og/home.png` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${brand.siteUrl}/og/home.png` },
    ],
    links: [
      { rel: "preload", href: alloFont, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: globalCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    ],
    scripts: [{ children: jsFlagScript }],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: ReactNode }) {
  return (
    // The site is dark-only. Set data-theme="light" to use the light tokens instead.
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
