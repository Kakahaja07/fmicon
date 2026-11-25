import { createFileRoute } from "@tanstack/react-router";
import { brand } from "~/content/site";
import { mcpPage } from "~/content/mcp";
import { McpChat } from "~/components/mcp/McpChat";
import { McpClients } from "~/components/mcp/McpClients";
import { AddIcon, BrushIcon, CodeIcon, Element3Icon, LayerIcon, SearchNormalIcon, type IconComponent } from "~/components/icons/Icons";
import { CopyPrompt } from "~/components/mcp/CopyPrompt";

const TOOL_ICONS: Record<string, IconComponent> = { search: SearchNormalIcon, code: CodeIcon, grid: Element3Icon, brush: BrushIcon, layer: LayerIcon };
import { Container } from "~/components/ui/Container";
import { pageHead } from "~/lib/iconSeo";
import { titleCase } from "~/lib/titleCase";
import s from "~/components/mcp/Mcp.module.css";

export const Route = createFileRoute("/_site/mcp")({
  head: () =>
    pageHead({
      title: `MCP Server: Free Icons in Claude, Cursor & VS Code - ${brand.name}`,
      description: "Connect Claude Code, Cursor, VS Code, Windsurf or Codex to fmicon with MCP. Your AI assistant searches 891 free icons and writes the code. Free, hosted, no API key.",
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
            <p className={s.eyebrow}>{mcpPage.demo.eyebrow}</p>
            <h2 id="mcp-demo" className={s.h2}>
              {titleCase(mcpPage.demo.title)}
            </h2>
            <p className={s.sub}>{mcpPage.demo.sub}</p>

            {/* Three steps on a guide line */}
            <ol className={s.steps3}>
              {mcpPage.demo.steps.map((step) => (
                <li key={step.title}>
                  <b>{step.title}</b>
                  <span>{step.text}</span>
                </li>
              ))}
            </ol>

            <h3 className={s.h3}>{mcpPage.prompts.title}</h3>
            <ul className={s.prompts}>
              {mcpPage.prompts.items.map((p) => (
                <li key={p}>
                  <CopyPrompt text={p} />
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
            {mcpPage.tools.items.map((t) => {
              const Icon = TOOL_ICONS[t.icon];
              return (
                <article key={t.name} className={s.toolCard}>
                  <span className={s.toolIcon}>
                    <Icon size={18} />
                  </span>
                  <code className={s.toolName}>{t.name}</code>
                  <p>{t.text}</p>
                  {/* A real call and what comes back */}
                  <div className={s.toolExample}>
                    <code>{t.call}</code>
                    <code className={s.toolResult}>→ {t.result}</code>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className={s.section} aria-labelledby="mcp-faq">
          <h2 id="mcp-faq" className={s.h2}>
            Frequently Asked Questions
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
