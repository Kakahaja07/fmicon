<div align="center">

<a href="https://fmicon.dev/mcp"><img src="https://raw.githubusercontent.com/Kakahaja07/fmicon/main/.github/assets/wordmark-light.png" width="260" alt="fmicon"></a>

### Free icons inside your AI assistant

<a href="https://github.com/Kakahaja07/fmicon/blob/main/LICENSE"><img src="https://img.shields.io/badge/licence-MIT-22c55e?style=flat-square" alt="MIT licence"></a>

**[Setup guide](https://fmicon.dev/mcp)** · **[Browse icons](https://fmicon.dev/icons)** · **[GitHub](https://github.com/Kakahaja07/fmicon)**

</div>

fmicon MCP is an [MCP](https://modelcontextprotocol.io) server. It lets AI tools like Claude Code, the Claude app, Cursor, VS Code, Windsurf and Codex search the 891 free fmicon icons and write the code for you, in any of 8 styles.

Ask things like:

- "Add a settings button with a gear icon to the navbar."
- "Pick icons for my sidebar: Dashboard, Projects, Team, Billing, Log out."
- "Give me the glass wallet icon as a 64 px SVG."

## Connect

It's hosted, so there is nothing to install. Add this URL to your app:

```
https://mcp.fmicon.dev/mcp
```

| App | How |
|---|---|
| Claude Code | `claude mcp add --transport http fmicon https://mcp.fmicon.dev/mcp` |
| Claude app | Settings → Connectors → Add custom connector, paste the URL |
| Cursor | `.cursor/mcp.json`: `{ "mcpServers": { "fmicon": { "url": "https://mcp.fmicon.dev/mcp" } } }` |
| VS Code | `code --add-mcp '{"name":"fmicon","type":"http","url":"https://mcp.fmicon.dev/mcp"}'` |
| Windsurf | `mcp_config.json`: `{ "mcpServers": { "fmicon": { "serverUrl": "https://mcp.fmicon.dev/mcp" } } }` |
| Codex | `codex mcp add fmicon --url https://mcp.fmicon.dev/mcp` |

Apps that only run local servers can use `npx -y mcp-remote https://mcp.fmicon.dev/mcp`.

## Tools

| Tool | What it does |
|---|---|
| `search_icons` | Finds icons by name or meaning ("gear", "delete", "user profile") |
| `get_icon` | Returns code for one icon: SVG, React, React Native, Vue, Svelte, vanilla JS or a CDN link, with style, size, colour and stroke |
| `match_icons` | Picks an icon for each label in a menu or toolbar at once |
| `list_styles` | The 9 styles and when to use each |
| `list_categories` | Categories with counts, or every icon in one category |

## Files

| File | What it is |
|---|---|
| `server.js` | The tools, shared by both versions |
| `worker.js` | The hosted version on Cloudflare Workers (`npx wrangler deploy`) |
| `index.js` | The same server over stdio, to run it yourself: `node index.js` |

## Licence

MIT. The icons are free for personal and commercial use.
