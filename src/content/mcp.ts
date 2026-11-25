/**
 * /mcp: the hosted fmicon MCP server (packages/mcp/worker.js on Cloudflare Workers).
 * Every app connects to one URL; nothing to install. The same tools also run locally (packages/mcp/index.js).
 */

export const MCP_URL = "https://mcp.fmicon.dev/mcp";

const json = (key: string) => JSON.stringify({ mcpServers: { fmicon: { [key]: MCP_URL } } }, null, 2);
const cursorConfig = btoa(JSON.stringify({ url: MCP_URL }));
const vscodeConfig = JSON.stringify({ name: "fmicon", type: "http", url: MCP_URL });

import type { AppId } from "~/components/ui/AppTile";

export type McpClient = {
  id: string;
  label: string;
  /** The app's icon (public/apps), or a drawn tile for apps without one */
  logo: AppId;
  /** One-click install link, where the app supports one */
  install?: { label: string; href: string };
  steps: string[];
  code: { lang: string; text: string };
};

export const mcpClients: McpClient[] = [
  {
    id: "claude-code",
    label: "Claude Code",
    logo: "claude-code",
    steps: ["Run this in your terminal.", "Start Claude Code and ask for an icon."],
    code: { lang: "bash", text: `claude mcp add --transport http fmicon ${MCP_URL}` },
  },
  {
    id: "claude",
    label: "Claude app",
    logo: "claude",
    steps: ["Open Settings → Connectors → Add custom connector.", "Name it fmicon, paste this URL and click Add."],
    code: { lang: "text", text: MCP_URL },
  },
  {
    id: "cursor",
    label: "Cursor",
    logo: "cursor",
    install: { label: "Add to Cursor", href: `cursor://anysphere.cursor-deeplink/mcp/install?name=fmicon&config=${cursorConfig}` },
    steps: ["Click Add to Cursor, or paste this into .cursor/mcp.json.", "Open the chat in Agent mode and ask for an icon."],
    code: { lang: "json", text: json("url") },
  },
  {
    id: "vscode",
    label: "VS Code",
    logo: "vscode",
    install: { label: "Add to VS Code", href: `vscode:mcp/install?${encodeURIComponent(vscodeConfig)}` },
    steps: ["Click Add to VS Code, or run this command.", "Open Copilot Chat in Agent mode and ask for an icon."],
    code: { lang: "bash", text: `code --add-mcp '${vscodeConfig}'` },
  },
  {
    id: "windsurf",
    label: "Windsurf",
    logo: "windsurf",
    steps: ["Open Settings → Cascade → MCP servers → View raw config.", "Paste this into mcp_config.json and refresh."],
    code: { lang: "json", text: json("serverUrl") },
  },
  {
    id: "codex",
    label: "Codex",
    logo: "codex",
    steps: ["Run this in your terminal.", "Start Codex and ask for an icon."],
    code: { lang: "bash", text: `codex mcp add fmicon --url ${MCP_URL}` },
  },
  {
    id: "other",
    label: "Any MCP app",
    logo: "other",
    steps: [
      "Add a remote (HTTP) MCP server with this URL in your app's settings.",
      "If your app only runs local servers, use the command: npx -y mcp-remote followed by this URL.",
    ],
    code: { lang: "text", text: MCP_URL },
  },
];

export const mcpPage = {
  eyebrow: "MCP server",
  title: "Connect Claude, Cursor and VS Code to fmicon",
  sub: "fmicon MCP lets your AI assistant search 891 free icons and write the code for you, in React, Vue, Svelte or plain SVG. Paste one URL into your app. Nothing to install, no account, no API key.",
  manual: "Using another app? Add a remote MCP server with this URL:",
  demo: {
    eyebrow: "How it works",
    title: "Ask for an icon in plain words",
    sub: "Your assistant searches fmicon, picks the right icon and adds it to your code.",
    steps: [
      { title: "Connect once", text: "Add the server URL to your AI app. It takes about a minute." },
      { title: "Ask in plain words", text: "Describe the button or menu you need, like you would to a teammate." },
      { title: "Get working code", text: "The right icon lands in your file, sized, labelled and ready to ship." },
    ],
  },
  tools: {
    title: "What Your Assistant Can Do",
    items: [
      { name: "search_icons", icon: "search", text: "Finds icons by name or meaning, so \"gear\" or \"delete\" lands on the right one.", call: 'search_icons("gear")', result: "setting-2, setting, setting-3" },
      { name: "get_icon", icon: "code", text: "Writes the code for one icon in SVG, React, React Native, Vue, Svelte, JS or a CDN link.", call: 'get_icon("lock", "react")', result: '<Lock size={24} />' },
      { name: "match_icons", icon: "grid", text: "Picks an icon for every item in a menu or toolbar at once.", call: 'match_icons(["Team", "Billing"])', result: "people, card" },
      { name: "list_styles", icon: "brush", text: "Explains the 8 styles and when to use each one.", call: "list_styles()", result: "linear, bold, glass…" },
      { name: "list_categories", icon: "layer", text: "Browses the 31 categories, from arrows to weather.", call: 'list_categories("Weather")', result: "cloud, sun, wind…" },
    ] as Array<{ name: string; icon: "search" | "code" | "grid" | "brush" | "layer"; text: string; call: string; result: string }>,
  },
  prompts: {
    title: "Try These Prompts",
    items: [
      "Add a settings button with a gear icon to the navbar.",
      "Pick icons for my sidebar: Dashboard, Projects, Team, Billing, Log out.",
      "Give me the glass wallet icon as a 64 px SVG for the hero.",
    ],
  },
  faq: [
    {
      q: "What is MCP?",
      a: "MCP (Model Context Protocol) is an open standard that lets AI assistants use tools. Once fmicon is connected, your assistant can search the icon set and write the code itself, instead of guessing an icon name or drawing one.",
    },
    {
      q: "Is fmicon MCP free?",
      a: "Yes. The server and all 891 icons are free and open source under the MIT licence. There is no account, no API key and no usage limit.",
    },
    {
      q: "Does it send my code anywhere?",
      a: "No. Your assistant only sends the icon request, like \"gear\" or \"lock in React\", to mcp.fmicon.dev. Your code and files stay on your computer, nothing is stored, and there are no accounts or tracking.",
    },
    {
      q: "Which apps work with it?",
      a: "Any app that supports remote MCP servers, including Claude Code, the Claude app, Cursor, VS Code with Copilot, Windsurf, Codex, Zed and Cline. Apps that only run local servers can connect through mcp-remote.",
    },
    {
      q: "Can I run it on my own computer instead?",
      a: "Yes. The same server ships in the fmicon GitHub repo as packages/mcp. Run node index.js inside it and point your app at that command instead of the URL. Nothing else changes, and it works fully offline.",
    },
    {
      q: "Is there a usage limit?",
      a: "No. There is no account, quota or paid tier. The server runs on Cloudflare's network and only returns icon names and code, so normal use by individuals and teams is free and unlimited.",
    },
    {
      q: "Do I need to install anything?",
      a: "No. The server is hosted on Cloudflare at mcp.fmicon.dev, so you only paste the URL into your app. It runs close to you, so answers come back fast from anywhere.",
    },
  ],
};
