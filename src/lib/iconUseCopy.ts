/**
 * A short, specific "what it means and how to use it" note for icon pages without a full article.
 * Built from the icon's name, category and style, so every page reads a little differently.
 */

const CONTEXTS: Record<string, string> = {
  archive: "storage screens, saved items and inbox clean-up actions",
  arrow: "navigation, carousels, back and next buttons, and sorting controls",
  astrology: "horoscope apps, lifestyle content and playful onboarding",
  building: "maps, office locations, real estate listings and company pages",
  business: "dashboards, reports, pricing pages and B2B tools",
  call: "contact buttons, support pages and calling apps",
  content: "editors, publishing tools and content management screens",
  "crypto-currency": "wallets, exchanges and payment flows",
  delivery: "order tracking, shipping steps and logistics dashboards",
  "design-tools": "creative apps, editors and toolbars",
  "computers-devices-electronics": "device settings, product pages and tech support",
  essetional: "navigation bars, toolbars, menus and everyday buttons",
  files: "file managers, uploads, downloads and document lists",
  grid: "layout switches, dashboards and view toggles",
  "school-learning": "courses, education apps and progress screens",
  location: "maps, store finders, delivery addresses and check-ins",
  "video-audio-image": "media players, galleries, recording tools and call controls",
  "emails-messages": "inboxes, chat apps, notifications and contact forms",
  money: "checkout, banking apps, invoices and pricing tables",
  notifications: "alerts, badges, reminders and settings",
  programing: "developer tools, docs and code editors",
  search: "search bars, filters and empty results",
  security: "login screens, permissions, privacy settings and 2FA",
  settings: "preferences, control panels and admin screens",
  shop: "online stores, carts, product cards and checkout",
  "support-like-question": "help centres, ratings, feedback and FAQ sections",
  time: "calendars, schedules, timers and booking flows",
  "car-linear": "transport apps, ride booking and travel planners",
  "type-paragraph-character": "text editors, formatting toolbars and CMS screens",
  users: "profiles, team pages, sign-up flows and account menus",
  weather: "forecasts, travel apps and smart-home dashboards",
};

const STYLE_TIPS: Record<string, string> = {
  linear: "The linear style keeps it light, so it sits well next to text at 16 to 24 px.",
  outline: "The outline style has closed shapes, which hold up well in print and design files.",
  bold: "The bold style is filled, so use it for the active or selected state.",
  bulk: "The bulk style adds a soft second layer that reads well on cards and feature lists.",
  twotone: "The twotone style adds a faded accent that helps in busy dashboards.",
  broken: "The broken style has small gaps that give a friendly, playful look.",
  glass: "The glass style is a 3D tile with its own colours, best on dark backgrounds and heroes.",
  duotone: "The duotone style adds a hint of colour while staying a clean line icon.",
  color: "The color style is bright and layered, and its parts move on hover, so it works for playful apps, onboarding and feature cards.",
};

export function iconUseCopy(name: string, category: string, categoryLabel: string, style: string) {
  const lower = name.toLowerCase();
  const context = CONTEXTS[category] ?? "apps, websites and design files";
  return {
    title: `How to Use the ${name} Icon`,
    paragraphs: [
      `The ${lower} icon belongs to the ${categoryLabel.toLowerCase()} set, and people recognise it quickly in ${context}. Use it where the action or state it shows needs to be clear at a glance, and pair it with a short text label the first time it appears, so nobody has to guess.`,
      `${STYLE_TIPS[style] ?? ""} If it is the only thing inside a button, add an aria-label such as "${name}" so screen readers can name it. Keep the tap area at least 44 px on touch screens, and let it inherit your text colour so it follows light, dark and hover states automatically.`,
    ],
  };
}
