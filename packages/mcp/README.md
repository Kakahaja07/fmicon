<div align="center">

<a href="https://fmicon.dev/mcp"><img src="https://raw.githubusercontent.com/Kakahaja07/fmicon/main/.github/assets/wordmark-light.png" width="260" alt="fmicon"></a>

### Free icons inside your AI assistant

<a href="https://www.npmjs.com/package/fmicon-mcp"><img src="https://img.shields.io/npm/v/fmicon-mcp?style=flat-square&color=1e8cff&label=npm" alt="npm version"></a>
<a href="https://github.com/Kakahaja07/fmicon/blob/main/LICENSE"><img src="https://img.shields.io/badge/licence-MIT-22c55e?style=flat-square" alt="MIT licence"></a>

**[Setup guide](https://fmicon.dev/mcp)** · **[Browse icons](https://fmicon.dev/icons)** · **[GitHub](https://github.com/Kakahaja07/fmicon)**

</div>

`fmicon-mcp` is an [MCP](https://modelcontextprotocol.io) server. It lets AI tools like Claude Code, Claude Desktop, Cursor, VS Code, Windsurf and Codex search the 891 free fmicon icons and write the code for you, in any of 8 styles.

Ask things like:

- "Add a settings button with a gear icon to the navbar."
- "Pick icons for my sidebar: Dashboard, Projects, Team, Billing, Log out."
- "Give me the glass wallet icon as a 64 px SVG."

It runs on your computer with `npx`. No account, no API key.

## Set it up

### Claude Code

```bash
claude mcp add fmicon -- npx -y fmicon-mcp
```

### Cursor, Windsurf, Claude Desktop and others

Add this to the tool's MCP config (`.cursor/mcp.json`, `~/.codeium/windsurf/mcp_config.json`, `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "fmicon": {
      "command": "npx",
      "args": ["-y", "fmicon-mcp"]
    }
  }
}
```

### VS Code

```bash
code --add-mcp '{"name":"fmicon","command":"npx","args":["-y","fmicon-mcp"]}'
```

### Codex

```bash
codex mcp add fmicon -- npx -y fmicon-mcp
```

On Windows, if a tool can't start `npx`, use `"command": "cmd"` and `"args": ["/c", "npx", "-y", "fmicon-mcp"]`.

## Tools

| Tool | What it does |
|---|---|
| `search_icons` | Finds icons by name or meaning ("gear", "delete", "user profile") |
| `get_icon` | Returns code for one icon: SVG, React, React Native, Vue, Svelte, vanilla JS or a CDN link, with style, size, colour and stroke |
| `match_icons` | Picks an icon for each label in a menu or toolbar at once |
| `list_styles` | The 9 styles and when to use each |
| `list_categories` | Categories with counts, or every icon in one category |

## Licence

MIT. The icons are free for personal and commercial use.
