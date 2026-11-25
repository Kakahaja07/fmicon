// Writes the FAQPage JSON-LD into every blog article in src/content/blog/*.html,
// copied word for word from the visible lead answer and FAQ section.
// Run after editing an article: npm run blog
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DIR = "src/content/blog";

const decode = (s) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
const text = (html) => decode(html.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();

for (const file of readdirSync(DIR).filter((f) => f.endsWith(".html"))) {
  const path = join(DIR, file);
  let html = readFileSync(path, "utf8");
  const body = html.slice(html.indexOf("<article>"));

  // Question/answer pairs: the lead block (first h3 + p) and every h3 + p after the FAQ heading.
  const pair = /<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g;
  const lead = pair.exec(body);
  const faqStart = body.indexOf("<h2>Frequently Asked Questions</h2>");
  if (!lead || faqStart < 0) throw new Error(`${file}: missing lead block or FAQ section`);
  const items = [lead];
  pair.lastIndex = faqStart;
  for (let m; (m = pair.exec(body)); ) items.push(m);

  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(([, q, a]) => ({
      "@type": "Question",
      name: text(q),
      acceptedAnswer: { "@type": "Answer", text: text(a) },
    })),
  };
  const block = `<script type="application/ld+json">\n${JSON.stringify(ld, null, 2)}\n</script>\n`;

  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\n/, "");
  html = html.replace("</head>", `${block}</head>`);
  writeFileSync(path, html);
  console.log(`✓ ${file}: ${items.length} questions`);
}
