// Small joining words stay lowercase inside a title (but not first, last, or after a colon).
const SMALL = new Set(["a", "an", "and", "as", "at", "but", "by", "for", "from", "in", "into", "nor", "of", "on", "or", "per", "the", "to", "vs", "with"]);

/**
 * Headings in title case: "8 icon styles in one library" → "8 Icon Styles in One Library".
 * Words that already have capitals (SVG, FM, iOS) and code-like words (@fmicons/react, ROND) are left alone.
 */
export function titleCase(text: string) {
  const words = text.split(/(\s+)/);
  let afterColon = true; // the first word always gets a capital
  return words
    .map((word, i) => {
      if (/^\s+$/.test(word)) return word;
      const isLast = i === words.length - 1;
      const lower = word.toLowerCase();
      const startsLower = /^[a-z]/.test(word);
      const bare = word.replace(/[.,:;!?)"']+$/, "");
      const plain = startsLower && !/[A-Z@/._`]/.test(bare);
      let out = word;
      if (plain && (afterColon || isLast || !SMALL.has(lower.replace(/[^a-z]/g, "")))) {
        // Capitalise each part of a hyphenated word: "open-source" → "Open-Source"
        out = word.replace(/(^|-)([a-z])/g, (_, dash: string, c: string) => dash + c.toUpperCase());
      }
      afterColon = /[:?!]$/.test(word);
      return out;
    })
    .join("");
}
