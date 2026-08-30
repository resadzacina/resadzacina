import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(readFileSync(join(root, "data/catalog.json"), "utf8"));

mkdirSync(join(root, "docs"), { recursive: true });
writeFileSync(join(root, "docs/catalog.json"), `${JSON.stringify(catalog, null, 2)}\n`);

const latest = catalog.items
  .slice()
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, 6)
  .map((item) => `- **${item.date}** · ${item.type} · [${item.title}](${item.url}) — ${item.source}`)
  .join("\n");

const readmePath = join(root, "README.md");
const readme = readFileSync(readmePath, "utf8");
const next = readme.replace(
  /<!-- latest:start -->[\s\S]*?<!-- latest:end -->/,
  `<!-- latest:start -->\n${latest}\n<!-- latest:end -->`
);

if (next === readme && !readme.includes("<!-- latest:start -->")) {
  throw new Error("README.md is missing the latest markers.");
}

writeFileSync(readmePath, next);
console.log(`Updated GitHub README and Media catalog (${catalog.items.length} items).`);
