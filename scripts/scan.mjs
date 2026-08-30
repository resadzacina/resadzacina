import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = join(root, "data/catalog.json");
const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));

const today = new Date().toISOString().slice(0, 10);
const knownUrls = new Set(catalog.items.map((item) => normalizeUrl(item.url)));
const knownKeys = new Set(catalog.items.flatMap((item) => identityKeys(item)));

function normalizeUrl(url) {
  return url.replace(/[?#].*$/, "").replace(/\/$/, "").toLowerCase();
}

function slug(url) {
  return normalizeUrl(url).split("/").filter(Boolean).at(-1) || "";
}

function identityKeys(item) {
  const title = (item.title || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  return [
    normalizeUrl(item.url),
    slug(item.url),
    `${title}::${item.date || ""}`
  ].filter(Boolean);
}

function decode(value) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
}

function guessTopics(title) {
  const text = title.toLowerCase();
  const topics = new Set();
  if (/spec[- ]driven|sdd/.test(text)) topics.add("spec-driven");
  if (/\bai\b|vibe coding|lovable|llm|agent/.test(text)) topics.add("ai");
  if (/studio|venture|startup studio|mop/.test(text)) topics.add("venture-building");
  if (/invest|angel|equity/.test(text)) topics.add("angel-investing");
  if (/product|mvp|quality|partner/.test(text)) topics.add("product-strategy");
  if (/deliver|ops|tool|analytics/.test(text)) topics.add("delivery");
  if (!topics.size) topics.add("product-strategy");
  return [...topics];
}

function parseRss(xml) {
  const items = [];
  const blocks = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
  for (const block of blocks) {
    const title = decode((block.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || "");
    const link = decode((block.match(/<link>([\s\S]*?)<\/link>/i) || [])[1] || "");
    const dateRaw = decode((block.match(/<pubDate>([\s\S]*?)<\/pubDate>/i) || [])[1] || "");
    const summary = decode((block.match(/<description>([\s\S]*?)<\/description>/i) || [])[1] || "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .slice(0, 220);
    const date = dateRaw ? new Date(dateRaw).toISOString().slice(0, 10) : today;
    if (title && link) items.push({ title, url: link, date, summary });
  }
  return items;
}

async function pullFeed(source) {
  if (!source.feed) return [];
  const response = await fetch(source.feed, {
    headers: { "user-agent": "resadzacina-archive-scan/1.0" }
  });
  if (!response.ok) {
    console.warn(`Skip ${source.id}: HTTP ${response.status}`);
    return [];
  }
  return parseRss(await response.text()).map((item) => ({
    ...item,
    source: source.label,
    type: source.kind === "video" ? "video" : "writing"
  }));
}

const incoming = [];
for (const source of catalog.sources) {
  try {
    incoming.push(...await pullFeed(source));
  } catch (error) {
    console.warn(`Skip ${source.id}: ${error.message}`);
  }
}

let added = 0;
for (const item of incoming) {
  const keys = identityKeys(item);
  if (keys.some((key) => knownUrls.has(key) || knownKeys.has(key))) continue;
  keys.forEach((key) => {
    knownUrls.add(key);
    knownKeys.add(key);
  });
  catalog.items.unshift({
    id: `scan-${Buffer.from(url).toString("base64url").slice(0, 16)}`,
    type: item.type,
    title: item.title,
    date: item.date,
    url: item.url,
    source: item.source,
    summary: item.summary || "Newly scanned from a watched feed.",
    topics: guessTopics(item.title)
  });
  added += 1;
}

catalog.scannedAt = today;
catalog.updatedAt = today;
writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`Scan complete. Added ${added} new item(s). Catalog now has ${catalog.items.length}.`);
