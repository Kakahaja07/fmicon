// fmicon MCP tools, shared by the hosted server (worker.js, https://mcp.fmicon.dev/mcp)
// and the local one (index.js, stdio). Search the 891 icons and return ready-to-paste code.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { toSvg } from "fmicon";
import { icons } from "fmicon/all";
import { z } from "zod";

export const VERSION = "1.0.0"; // keep in step with package.json
const SITE = "https://fmicon.dev";
const CDN = "https://cdn.fmicon.dev";

const STYLES = ["linear", "outline", "bold", "bulk", "twotone", "broken", "glass", "glass-light", "duotone"];
const STYLE_NOTES = {
  linear: "Clean 1.5px lines. The default for toolbars, menus and tab bars.",
  outline: "Outlined shapes, closed paths. Good for design files and print.",
  bold: "Solid fill. Use for selected or active states (e.g. the current tab).",
  bulk: "Two-tone fill with a soft secondary layer. Good for feature lists and cards.",
  twotone: "Lines with a faded second tone. Good for dashboards.",
  broken: "Lines with small gaps. A playful, friendly look.",
  glass: "3D frosted glass with its own colours, tuned for dark backgrounds. App tiles and heroes.",
  "glass-light": "The glass style tuned for light backgrounds.",
  duotone: "Lines with a hint of colour. Accepts a colour and stroke width.",
};
const LINE_STYLES = new Set(["linear", "twotone", "broken", "duotone"]);

const CATEGORY_LABELS = {
  archive: "Archive", arrow: "Arrow", astrology: "Astrology", building: "Building", business: "Business",
  call: "Call", content: "Content", "crypto-currency": "Crypto", delivery: "Delivery", "design-tools": "Design tools",
  "computers-devices-electronics": "Devices", essetional: "Essentials", files: "Files", grid: "Grid",
  "school-learning": "Learning", location: "Location", "video-audio-image": "Media", "emails-messages": "Messages",
  money: "Money", notifications: "Notifications", programing: "Programming", search: "Search", security: "Security",
  settings: "Settings", shop: "Shop", "support-like-question": "Support & likes", time: "Time",
  "car-linear": "Transport", "type-paragraph-character": "Typography", users: "Users", weather: "Weather",
};
const categoryLabel = (slug) => CATEGORY_LABELS[slug] ?? slug;

// Everyday UI words mapped to the icon that fits best, so "gear" or "delete" finds the right one.
const SYNONYMS = {
  settings: "setting-2", setting: "setting-2", gear: "setting-2", cog: "setting-2", preferences: "setting-2",
  delete: "trash", remove: "trash", bin: "trash", trash: "trash", garbage: "trash",
  close: "close-circle", x: "close-circle", dismiss: "close-circle", cancel: "close-circle", exit: "close-circle",
  plus: "add", new: "add", create: "add", add: "add",
  person: "user", account: "user", avatar: "user", profile: "profile-circle", user: "user",
  team: "people", users: "people", group: "people", members: "people",
  logout: "logout", "sign out": "logout", signout: "logout", login: "login", "sign in": "login", signin: "login",
  search: "search-normal", find: "search-normal", magnifier: "search-normal", lookup: "search-normal",
  hamburger: "menu", menu: "menu", nav: "menu",
  bell: "notification", notification: "notification", alert: "notification", notifications: "notification",
  cart: "shopping-cart", basket: "shopping-cart", checkout: "shopping-cart",
  like: "heart", love: "heart", favorite: "heart", favourite: "heart", heart: "heart",
  rating: "star", star: "star", bookmark: "bookmark", save: "bookmark",
  check: "tick-circle", tick: "tick-circle", done: "tick-circle", success: "tick-circle", ok: "tick-circle", verified: "tick-circle",
  warning: "warning-2", caution: "warning-2", error: "danger", danger: "danger",
  info: "info-circle", help: "message-question", question: "message-question", faq: "message-question",
  edit: "edit-2", pencil: "edit-2", write: "edit-2", rename: "edit-2",
  copy: "copy", duplicate: "copy", clipboard: "copy",
  share: "share", send: "send-2", submit: "send-2",
  download: "document-download", upload: "export", export: "export", import: "import",
  mail: "sms", email: "sms", inbox: "sms", envelope: "sms",
  chat: "message", message: "message", comment: "message", messages: "messages",
  phone: "call", call: "call", calendar: "calendar", date: "calendar", schedule: "calendar", event: "calendar",
  clock: "clock", time: "clock", timer: "timer", history: "clock",
  location: "location", pin: "location", map: "map", address: "location",
  home: "home", house: "home", dashboard: "element-3", grid: "element-3", apps: "category",
  image: "gallery", photo: "gallery", picture: "gallery", gallery: "gallery", camera: "camera",
  lock: "lock", secure: "lock", password: "lock", private: "lock", unlock: "unlock",
  show: "eye", view: "eye", visible: "eye", eye: "eye", hide: "eye-slash", hidden: "eye-slash",
  filter: "filter", sort: "sort", refresh: "refresh", reload: "refresh", sync: "refresh",
  key: "key", wallet: "wallet", payment: "card", card: "card", money: "moneys", pay: "card", billing: "card",
  chart: "chart", analytics: "chart", stats: "chart", graph: "chart",
  folder: "folder", file: "document", document: "document", doc: "document-text",
  cloud: "cloud", link: "link", url: "link", web: "global", globe: "global", language: "global", website: "global",
  wifi: "wifi", mic: "microphone", microphone: "microphone", video: "video", play: "play", pause: "pause",
  music: "music", sound: "volume-high", volume: "volume-high", audio: "volume-high",
  sun: "sun", light: "sun", moon: "moon", dark: "moon", theme: "moon",
  code: "code", developer: "code", terminal: "command", command: "command", keyboard: "keyboard",
  desktop: "monitor", computer: "monitor", monitor: "monitor", mobile: "mobile", phone_device: "mobile",
  print: "printer", printer: "printer", tag: "tag", label: "tag", gift: "gift", box: "box", package: "box",
  shipping: "truck", delivery: "truck", truck: "truck", bag: "bag", shop: "shop", store: "shop",
  award: "medal", trophy: "cup", crown: "crown", premium: "crown",
  security: "shield-tick", shield: "shield-tick", privacy: "shield-tick",
  scan: "scan", barcode: "barcode", ai: "magicpen", magic: "magicpen", sparkle: "magicpen",
  brush: "brush", design: "brush", color: "colorfilter", colour: "colorfilter", palette: "color-swatch",
  attach: "paperclip", attachment: "paperclip", paperclip: "paperclip",
  more: "more", options: "more", ellipsis: "more", activity: "activity", health: "health",
  project: "briefcase", projects: "briefcase", work: "briefcase", portfolio: "briefcase",
  task: "task-square", tasks: "task-square", todo: "task-square", checklist: "task-square",
  invoice: "receipt", receipt: "receipt", bill: "receipt", order: "receipt", orders: "receipt",
  note: "note", notes: "note", book: "book", docs: "book", documentation: "book", learn: "teacher", course: "teacher",
  report: "document-text", reports: "document-text", archive: "archive", support: "message-question",
  growth: "trend-up", trending: "trend-up", sales: "status-up", revenue: "status-up", presentation: "presention-chart",
  next: "arrow-right", forward: "arrow-right", back: "arrow-left", previous: "arrow-left", up: "arrow-up", down: "arrow-down",
};

const byName = new Map(icons.map((icon) => [icon.name, icon]));
const tokens = (s) => s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);

/** "arrow-circle-right" -> "ArrowCircleRight"; names that start with a digit get an Icon prefix. */
const component = (name) => {
  const pascal = name.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
  return /^[0-9]/.test(pascal) ? `Icon${pascal}` : pascal;
};
/** "arrow-circle-right" -> "arrowCircleRight" (the export name in the fmicon package). */
const camel = (name) => {
  const c = name.replace(/-([a-z0-9])/g, (_, ch) => ch.toUpperCase());
  return /^[0-9]/.test(c) ? `icon${c[0].toUpperCase()}${c.slice(1)}` : c;
};
const pageUrl = (name, style = "linear") => `${SITE}/icons/${style}/${name}`;

function score(icon, query) {
  const q = query.toLowerCase().trim();
  const words = tokens(q);
  const name = icon.name;
  const nameWords = tokens(name);
  const label = categoryLabel(icon.category).toLowerCase();
  let s = 0;
  if (name === q.replace(/\s+/g, "-")) s += 100;
  if (SYNONYMS[q] === name) s += 90;
  for (const raw of words) {
    const w = SYNONYMS[raw] || !raw.endsWith("s") ? raw : raw.slice(0, -1);
    const target = SYNONYMS[w];
    if (target === name) s += 60;
    else if (target && name.split("-")[0] === target.split("-")[0]) s += 30;
    if (nameWords.includes(w)) s += 40;
    else if (name.includes(w)) s += 20;
    if (label.includes(w)) s += 8;
  }
  // Prefer the plain version over numbered variants ("home" before "home-3")
  if (s > 0) s -= nameWords.filter((w) => /^\d+$/.test(w)).length * 3 + name.length * 0.05;
  return s;
}

function search(query, limit) {
  return icons
    .map((icon) => ({ icon, s: score(icon, query) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((r) => r.icon);
}

function findIcon(name) {
  const key = name.toLowerCase().trim().replace(/\s+/g, "-");
  const single = key.endsWith("s") ? key.slice(0, -1) : key;
  return byName.get(key) ?? byName.get(SYNONYMS[key]) ?? byName.get(SYNONYMS[single]) ?? search(name, 1)[0];
}

const attrs = ({ size, color, strokeWidth, style }) =>
  [
    size !== 24 ? `size={${size}}` : "",
    style !== "linear" ? `variant="${style}"` : "",
    color ? `color="${color}"` : "",
    strokeWidth && LINE_STYLES.has(style) ? `strokeWidth={${strokeWidth}}` : "",
  ]
    .filter(Boolean)
    .join(" ");

function codeFor(icon, { format, style, size, color, strokeWidth, title }) {
  const C = component(icon.name);
  const props = attrs({ size, color, strokeWidth, style });
  const tag = `<${C}${props ? ` ${props}` : ""}${title ? ` title="${title}"` : ""} />`;
  switch (format) {
    case "react":
      return { install: "npm i fmicon-react", lang: "tsx", code: `import { ${C} } from "fmicon-react";\n\n${tag}`, docs: `${SITE}/docs/react` };
    case "react-native":
      return {
        install: "npm i fmicon-react-native react-native-svg",
        lang: "tsx",
        code: `import { ${C} } from "fmicon-react-native";\n\n${tag}`,
        docs: `${SITE}/docs/react-native`,
      };
    case "vue":
      return {
        install: "npm i fmicon-vue",
        lang: "vue",
        code: `<script setup>\nimport { ${C} } from "fmicon-vue";\n</script>\n\n<template>\n  ${tag}\n</template>`,
        docs: `${SITE}/docs/vue`,
      };
    case "svelte": {
      const sv = [`icon={${camel(icon.name)}}`, size !== 24 ? `size={${size}}` : "", style !== "linear" ? `variant="${style}"` : "", color ? `color="${color}"` : ""]
        .filter(Boolean)
        .join(" ");
      return {
        install: "npm i fmicon-svelte",
        lang: "svelte",
        code: `<script>\n  import { Icon } from "fmicon-svelte";\n  import { ${camel(icon.name)} } from "fmicon";\n</script>\n\n<Icon ${sv} />`,
        docs: `${SITE}/docs/svelte`,
      };
    }
    case "js":
      return {
        install: "npm i fmicon",
        lang: "js",
        code: `import { toSvg } from "fmicon";\nimport { ${camel(icon.name)} } from "fmicon/icons/${icon.name}";\n\nel.innerHTML = toSvg(${camel(icon.name)}, { size: ${size}, variant: "${style}"${color ? `, color: "${color}"` : ""} });`,
        docs: `${SITE}/docs/vanilla`,
      };
    case "cdn":
      return {
        lang: "html",
        code: `<img src="${CDN}/svg/${style}/${icon.name}.svg" width="${size}" height="${size}" alt="${title ?? ""}">\n<!-- PNG (256px): ${CDN}/png/${style}/${icon.name}.png -->`,
        docs: `${SITE}/docs/svg`,
      };
    default:
      return {
        lang: "svg",
        code: toSvg(icon, { size, variant: style, color, strokeWidth: LINE_STYLES.has(style) ? strokeWidth : undefined, title }),
        docs: `${SITE}/docs/svg`,
      };
  }
}

const text = (t) => ({ content: [{ type: "text", text: t }] });
const styleEnum = z.enum(STYLES);
const formatEnum = z.enum(["svg", "react", "react-native", "vue", "svelte", "js", "cdn"]);

/** A fresh MCP server with every fmicon tool. Options go to McpServer (e.g. a JSON schema validator). */
export function createServer(options = {}) {
  const server = new McpServer({ name: "fmicon", version: VERSION }, options);

  server.registerTool(
    "search_icons",
    {
      title: "Search icons",
      description:
        "Search the 891 free fmicon icons by name, meaning or UI purpose (e.g. 'settings', 'delete', 'user profile', 'arrow right'). Returns the best matches with their component name and page link. Call get_icon next for the code.",
      inputSchema: {
        query: z.string().min(1).describe("What the icon is for, e.g. 'gear', 'logout', 'shopping cart'"),
        limit: z.number().int().min(1).max(50).default(10).describe("How many results, 1 to 50"),
      },
    },
    async ({ query, limit }) => {
      const found = search(query, limit);
      if (!found.length) return text(`No icons matched "${query}". Try a simpler word (e.g. "user" instead of "customer account"), or call list_categories.`);
      const lines = found.map((i) => `- ${i.name} (${categoryLabel(i.category)}) · React: <${component(i.name)} /> · ${pageUrl(i.name)}`);
      return text(`${found.length} icons for "${query}":\n${lines.join("\n")}\n\nEvery icon comes in these styles: ${STYLES.join(", ")}.`);
    },
  );

  server.registerTool(
    "get_icon",
    {
      title: "Get icon code",
      description:
        "Get ready-to-paste code for one fmicon icon: raw SVG, React, React Native, Vue, Svelte, vanilla JS or a CDN link. Choose a style, size, colour and stroke width. Includes the install command.",
      inputSchema: {
        name: z.string().min(1).describe("Icon name from search_icons, e.g. 'setting-2'. A plain word like 'gear' also works."),
        format: formatEnum.default("svg").describe("svg, react, react-native, vue, svelte, js (vanilla) or cdn"),
        style: styleEnum.default("linear").describe("linear (default), outline, bold, bulk, twotone, broken, glass, glass-light, duotone"),
        size: z.number().int().min(8).max(512).default(24).describe("Width and height in px"),
        color: z.string().optional().describe("Any CSS colour. Omit to inherit the text colour (currentColor). Glass styles ignore it."),
        strokeWidth: z.number().min(0.5).max(3).optional().describe("Line styles only (linear, twotone, broken, duotone). Default 1.5"),
        title: z.string().optional().describe("Accessible name. Only for icons that carry meaning on their own"),
      },
    },
    async ({ name, format, style, size, color, strokeWidth, title }) => {
      const icon = findIcon(name);
      if (!icon) return text(`No icon called "${name}". Call search_icons first.`);
      const out = codeFor(icon, { format, style, size, color, strokeWidth, title });
      const note = icon.name !== name ? `(Closest match for "${name}": ${icon.name})\n\n` : "";
      return text(
        `${note}${icon.name} · ${style} · ${format}\n` +
          (out.install ? `\nInstall: ${out.install}\n` : "") +
          `\n\`\`\`${out.lang}\n${out.code}\n\`\`\`\n` +
          `\nPreview: ${pageUrl(icon.name, style)}\nDocs: ${out.docs}\n` +
          (title ? "" : "Tip: if this icon is the only content of a button, put aria-label on the button."),
      );
    },
  );

  server.registerTool(
    "match_icons",
    {
      title: "Match icons to UI labels",
      description:
        "Pick one icon for each label in a UI at once, e.g. a sidebar or toolbar: ['Dashboard', 'Settings', 'Log out']. Returns the best icon and component name for each.",
      inputSchema: {
        labels: z.array(z.string().min(1)).min(1).max(40).describe("The button or menu labels that need icons"),
      },
    },
    async ({ labels }) => {
      const rows = labels.map((label) => {
        const icon = findIcon(label);
        return icon ? `- ${label} → ${icon.name} · <${component(icon.name)} />` : `- ${label} → no match`;
      });
      return text(`${rows.join("\n")}\n\nUse one style everywhere (linear), and bold for the active item.`);
    },
  );

  server.registerTool(
    "list_styles",
    { title: "List icon styles", description: "The 9 fmicon styles and when to use each one.", inputSchema: {} },
    async () => text(STYLES.map((st) => `- ${st}: ${STYLE_NOTES[st]}`).join("\n")),
  );

  server.registerTool(
    "list_categories",
    {
      title: "List icon categories",
      description: "The icon categories with counts. Pass a category to list its icon names.",
      inputSchema: { category: z.string().optional().describe("A category label or slug, e.g. 'Arrow' or 'users'") },
    },
    async ({ category }) => {
      if (category) {
        const c = category.toLowerCase();
        const slug = Object.keys(CATEGORY_LABELS).find((k) => k === c || CATEGORY_LABELS[k].toLowerCase() === c);
        const list = icons.filter((i) => i.category === slug).map((i) => i.name);
        return text(list.length ? `${categoryLabel(slug)} (${list.length}): ${list.join(", ")}` : `No category "${category}".`);
      }
      const counts = {};
      for (const i of icons) counts[i.category] = (counts[i.category] ?? 0) + 1;
      return text(
        Object.entries(counts)
          .sort((a, b) => categoryLabel(a[0]).localeCompare(categoryLabel(b[0])))
          .map(([slug, n]) => `- ${categoryLabel(slug)}: ${n}`)
          .join("\n"),
      );
    },
  );

  return server;
}
