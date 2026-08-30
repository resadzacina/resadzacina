import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(readFileSync(join(root, "data/catalog.json"), "utf8"));

const SECTIONS = [
  ["writing", "Articles"],
  ["press", "Press"],
  ["podcast", "Podcasts"],
  ["talk", "Talks"],
  ["video", "Video"],
  ["post", "Posts"]
];

function byDate(items) {
  return items.slice().sort((a, b) => b.date.localeCompare(a.date));
}

function line(item) {
  return `- **${item.date}** · [${item.title}](${item.url}) — ${item.source}`;
}

const items = byDate(catalog.items || []);

mkdirSync(join(root, "docs"), { recursive: true });
writeFileSync(join(root, "docs/catalog.json"), `${JSON.stringify(catalog, null, 2)}\n`);

const latest = items.slice(0, 6).map((item) => (
  `- **${item.date}** · ${item.type} · [${item.title}](${item.url}) — ${item.source}`
)).join("\n");

const readmePath = join(root, "README.md");
const readme = readFileSync(readmePath, "utf8");
if (!readme.includes("<!-- latest:start -->")) {
  throw new Error("README.md is missing the latest markers.");
}
writeFileSync(
  readmePath,
  readme.replace(
    /<!-- latest:start -->[\s\S]*?<!-- latest:end -->/,
    `<!-- latest:start -->\n${latest}\n<!-- latest:end -->`
  )
);

const archiveBody = [
  "# Archive",
  "",
  `Generated ${catalog.scannedAt || catalog.updatedAt} from [\`data/catalog.json\`](data/catalog.json).`,
  "Same pipeline as the [GitHub profile](README.md) and [Media](https://resadzacina.com/media.html).",
  "",
  `**${items.length} records.**`,
  "",
  "## Latest",
  "",
  latest,
  "",
  ...SECTIONS.flatMap(([type, heading]) => {
    const rows = items.filter((item) => item.type === type);
    if (!rows.length) return [];
    return [`## ${heading}`, "", ...rows.map(line), ""];
  })
].join("\n");

writeFileSync(join(root, "ARCHIVE.md"), `${archiveBody}\n`);

console.log(`Published ${items.length} items → README.md, ARCHIVE.md, docs/catalog.json`);
