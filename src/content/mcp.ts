/**
 * /mcp: the fmicon MCP server (packages/mcp, published as fmicon-mcp).
 * One config for every client: npx runs the server locally over stdio.
 */

const command = "npx";
const args = ["-y", "fmicon-mcp"];
const json = JSON.stringify({ mcpServers: { fmicon: { command, args } } }, null, 2);

const cursorConfig = btoa(JSON.stringify({ command, args }));

export type McpClient = {
  id: string;
  label: string;
  /** An AI tool logo id from AiLogo, or a plain icon */
  logo: "claude" | "cursor" | "githubcopilot" | "windsurf" | "codex" | "other";
  /** One-click install link, where the app supports one */
  install?: { label: string; href: string };
  steps: string[];
  code: { lang: string; text: string };
};

export const mcpClients: McpClient[] = [
  {
    id: "claude-code",
    label: "Claude Code",
    logo: "claude",
    steps: ["Run this in your terminal.", "Start Claude Code and ask for an icon."],
    code: { lang: "bash", text: "claude mcp add fmicon -- npx -y fmicon-mcp" },
  },
  {
    id: "claude-desktop",
    label: "Claude Desktop",
    logo: "claude",
    steps: ["Open Settings → Developer → Edit Config.", "Paste this into claude_desktop_config.json and restart Claude."],
    code: { lang: "json", text: json },
  },
  {
    id: "cursor",
    label: "Cursor",
    logo: "cursor",
    install: { label: "Add to Cursor", href: `cursor://anysphere.cursor-deeplink/mcp/install?name=fmicon&config=${cursorConfig}` },
    steps: ["Click Add to Cursor, or paste this into .cursor/mcp.json.", "Open the chat in Agent mode and ask for an icon."],
    code: { lang: "json", text: json },
  },
  {
    id: "vscode",
    label: "VS Code",
    logo: "githubcopilot",
    install: {
      label: "Add to VS Code",
      href: `vscode:mcp/install?${encodeURIComponent(JSON.stringify({ name: "fmicon", command, args }))}`,
    },
    steps: ["Click Add to VS Code, or run this command.", "Open Copilot Chat in Agent mode and ask for an icon."],
    code: { lang: "bash", text: `code --add-mcp '{"name":"fmicon","command":"npx","args":["-y","fmicon-mcp"]}'` },
  },
  {
    id: "windsurf",
    label: "Windsurf",
    logo: "windsurf",
    steps: ["Open Settings → Cascade → MCP servers → View raw config.", "Paste this into mcp_config.json and refresh."],
    code: { lang: "json", text: json },
  },
  {
    id: "codex",
    label: "Codex",
    logo: "codex",
    steps: ["Run this in your terminal.", "Start Codex and ask for an icon."],
    code: { lang: "bash", text: "codex mcp add fmicon -- npx -y fmicon-mcp" },
  },
  {
    id: "other",
    label: "Any MCP app",
    logo: "other",
    steps: ["Add a stdio server with this command to your app's MCP settings.", "On Windows, if npx won't start, use command \"cmd\" with args [\"/c\", \"npx\", \"-y\", \"fmicon-mcp\"]."],
    code: { lang: "json", text: json },
  },
];

export const mcpPage = {
  eyebrow: "MCP server",
  title: "Connect Claude, Cursor and VS Code to fmicon",
  sub: "fmicon MCP lets your AI assistant search 891 free icons and write the code for you, in React, Vue, Svelte or plain SVG. It runs on your computer. No account, no API key.",
  manual: "Using another app? Add a stdio server with this command:",
  demo: {
    title: "Ask for an icon in plain words",
    sub: "Your assistant searches fmicon, picks the right icon and adds it to your code.",
  },
  tools: {
    title: "What Your Assistant Can Do",
    items: [
      { name: "search_icons", text: "Finds icons by name or meaning, so \"gear\" or \"delete\" lands on the right one." },
      { name: "get_icon", text: "Writes the code for one icon in SVG, React, React Native, Vue, Svelte, JS or a CDN link." },
      { name: "match_icons", text: "Picks an icon for every item in a menu or toolbar at once." },
      { name: "list_styles", text: "Explains the 8 styles and when to use each one." },
      { name: "list_categories", text: "Browses the 31 categories, from arrows to weather." },
    ],
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
      a: "No. The server runs on your computer through npx and only answers questions about icons. All the icon data ships inside the package, so it doesn't call any server.",
    },
    {
      q: "Which apps work with it?",
      a: "Any app that supports local (stdio) MCP servers, including Claude Code, Claude Desktop, Cursor, VS Code with Copilot, Windsurf, Codex, Zed and Cline.",
    },
    {
      q: "What do I need installed?",
      a: "Node.js 18 or newer, which gives you npx. The first run downloads the package; after that it starts in about a second.",
    },
  ],
};
