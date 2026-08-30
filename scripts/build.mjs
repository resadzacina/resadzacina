import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(readFileSync(join(root, "data/catalog.json"), "utf8"));

mkdirSync(join(root, "docs"), { recursive: true });
writeFileSync(join(root, "docs/catalog.json"), `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`Copied catalog.json (${catalog.items.length} items) for the Media page.`);
