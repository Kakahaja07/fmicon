import { brand, openSource } from "~/content/site";
import { docsProps, type DocPage } from "~/content/docs";
import { freeIconsMeta } from "~/content/freeIcons.meta";

/* Turn a docs page into text you can paste anywhere: Markdown for notes and READMEs,
   or a short brief for an AI coding agent. */

const site = brand.siteUrl.replace(/\/$/, "");
const fence = (lang: string, code: string) => "```" + lang + "\n" + code + "\n```";
const langOf = (title: string) =>
  /\.vue$/.test(title) ? "vue" : /\.svelte$/.test(title) ? "svelte" : /\.dart|Widget/.test(title) ? "dart" : /\.ya?ml$/.test(title) ? "yaml" : /HTML|\.html/.test(title) ? "html" : "jsx";

function installLine(page: DocPage) {
  return page.installCommand ?? (page.install ? `npm i ${page.install.join(" ")}` : undefined);
}

/** The whole page as Markdown. */
export function pageToMarkdown(page: DocPage) {
  const out: string[] = [];
  page.sections.forEach((section, i) => {
    out.push(`${i === 0 ? "#" : "##"} ${section.title}`);
    section.text?.forEach((t) => out.push(t));
    if (section.list) out.push(section.list.map((l) => `- ${l}`).join("\n"));
    if (section.block === "install") {
      const line = installLine(page);
      if (line) out.push(fence("bash", line));
    }
    if (section.block === "props") {
      out.push(
        ["| Prop | Type | Default | Description |", "| --- | --- | --- | --- |", ...docsProps.map((p) => `| \`${p.prop}\` | \`${p.type}\` | \`${p.def}\` | ${p.text} |`)].join("\n"),
      );
    }
    if (section.block === "styles") out.push(`Styles: ${freeIconsMeta.styles.map((s) => `\`${s}\``).join(", ")}, plus \`glass-light\`.`);
    section.code?.forEach((c) => out.push(`**${c.title}**\n\n${fence(langOf(c.title), c.code)}`));
    if (section.tip) out.push(`> Tip: ${section.tip}`);
  });
  out.push(`Source: ${site}/docs/${page.id}`);
  return out.join("\n\n");
}

/** A short brief an AI coding agent can follow to add fmicon to a project. */
export function pageToPrompt(page: DocPage) {
  const install = installLine(page);
  const usage = page.sections.find((s) => s.id === "usage")?.code?.[0]?.code;
  const lines = [
    `Add ${brand.name} (${site}), a free, open-source icon library with ${freeIconsMeta.total} icons in ${freeIconsMeta.styles.length} styles, to this ${page.label} project.`,
    "",
    install ? `Install: ${install} (use the package manager that matches the project's lockfile: npm, pnpm, yarn or bun).` : `There is no package for ${page.label}: copy each icon's ready code from its page at ${site}/icons, or load SVG files from ${openSource.cdn}/<style>/<slug>.svg.`,
    "",
    "Rules:",
    "- Find icon names at " + site + "/icons. The URL slug is the name, e.g. /icons/linear/arrow-circle-right.",
    "- Components are the PascalCase of the slug (ArrowCircleRight). Every component is also exported with an Icon suffix (ArrowCircleRightIcon) to avoid clashes with globals like Map or Image.",
    "- In @fmicons/core, icon data is camelCase (arrowCircleRight); reserved words get an Icon suffix (exportIcon).",
    `- Props: ${docsProps.map((p) => `${p.prop} (default ${p.def})`).join(", ")}.`,
    `- variant is one of: ${freeIconsMeta.styles.join(", ")}, glass-light. Use linear for idle states and bold for selected ones.`,
    "- Icons inherit the text colour (currentColor). Set color only when it must differ. Glass keeps its own colours.",
    "- Icon-only buttons need an aria-label on the button. Icons next to visible text need nothing.",
    "- Import named icons only; never import * from the package.",
  ];
  if (usage) lines.push("", "Example:", fence(langOf(page.sections.find((s) => s.id === "usage")!.code![0].title), usage));
  lines.push("", `Full docs: ${site}/docs/${page.id}`);
  return lines.join("\n");
}
