import { createFileRoute } from "@tanstack/react-router";
import { brand } from "~/content/site";
import { mcpPage } from "~/content/mcp";
import { McpChat } from "~/components/mcp/McpChat";
import { McpClients } from "~/components/mcp/McpClients";
import { AddIcon, MessageIcon } from "~/components/icons/Icons";
import { Container } from "~/components/ui/Container";
import { pageHead } from "~/lib/iconSeo";
import { titleCase } from "~/lib/titleCase";
import s from "~/components/mcp/Mcp.module.css";

export const Route = createFileRoute("/_site/mcp")({
  head: () =>
    pageHead({
      title: `fmicon MCP: Free Icons in Claude, Cursor & VS Code`,
      description: "Connect Claude Code, Cursor, VS Code, Windsurf or Codex to fmicon with MCP. Your AI assistant searches 891 free icons and writes the code. Free, local, no API key.",
      path: "/mcp",
      image: "docs",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "fmicon MCP",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Windows, macOS, Linux",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          url: `${brand.siteUrl}/mcp`,
          downloadUrl: "https://www.npmjs.com/package/fmicon-mcp",
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: mcpPage.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        },
      ],
    }),
  component: McpPage,
});

function McpPage() {
  return (
    <main className={s.page}>
      <Container>
        <header className={s.intro}>
          <p className={s.eyebrow}>{mcpPage.eyebrow}</p>
          <h1 className={s.h1}>{titleCase(mcpPage.title)}</h1>
          <p className={s.sub}>{mcpPage.sub}</p>
        </header>

        <McpClients />

        <section className={s.demo} aria-labelledby="mcp-demo">
          <div className={s.demoText}>
            <h2 id="mcp-demo" className={s.h2}>
              {titleCase(mcpPage.demo.title)}
            </h2>
            <p className={s.sub}>{mcpPage.demo.sub}</p>
            <h3 className={s.h3}>{mcpPage.prompts.title}</h3>
            <ul className={s.prompts}>
              {mcpPage.prompts.items.map((p) => (
                <li key={p}>
                  <MessageIcon size={16} />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <McpChat />
        </section>

        <section className={s.section} aria-labelledby="mcp-tools">
          <h2 id="mcp-tools" className={s.h2}>
            {mcpPage.tools.title}
          </h2>
          <div className={s.toolGrid}>
            {mcpPage.tools.items.map((t) => (
              <article key={t.name} className={s.toolCard}>
                <code className={s.toolName}>{t.name}</code>
                <p>{t.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={s.section} aria-labelledby="mcp-faq">
          <h2 id="mcp-faq" className={s.h2}>
            Questions, Answered
          </h2>
          <div className={s.faq}>
            {mcpPage.faq.map((f) => (
              <details key={f.q} className={s.qa}>
                <summary>
                  {f.q}
                  <AddIcon size={16} />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}
