# Media catalog

`catalog.json` is the pipeline for this GitHub profile. It is not the live website. How the pipeline works: [FRESHNESS.md](../FRESHNESS.md).

`scripts/scan.mjs` pulls watched feeds. `scripts/build.mjs` publishes to:

| Surface | Output |
| --- | --- |
| GitHub profile | `README.md` Latest strip |
| GitHub archive | `ARCHIVE.md` |
| Handoff for the Vercel site | `site-media/catalog.json` |

resadzacina.com is a different repo. Copy files from `site-media/` into that repo to expand Media only.

```json
{
  "id": "unique-kebab-id",
  "type": "writing",
  "title": "Title as published",
  "date": "2026-08-30",
  "url": "https://example.com/the-piece",
  "source": "Where it lived",
  "summary": "One or two sentences.",
  "topics": ["ai"]
}
```

`type` must be one of: `writing`, `press`, `podcast`, `video`, `talk`, `post`.

```bash
node scripts/scan.mjs
node scripts/build.mjs
```
