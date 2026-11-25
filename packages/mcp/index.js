#!/usr/bin/env node
// fmicon MCP server, local version over stdio:  node index.js  (or npx fmicon-mcp)
// The hosted version runs the same tools at https://mcp.fmicon.dev/mcp (worker.js).
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server.js";

await createServer().connect(new StdioServerTransport());
