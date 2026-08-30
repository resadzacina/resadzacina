# Media catalog

`catalog.json` is the single pipeline. `scripts/scan.mjs` pulls watched feeds. `scripts/build.mjs` publishes to every surface:

| Surface | Output |
| --- | --- |
| GitHub profile | `README.md` Latest strip |
| GitHub archive | `ARCHIVE.md` — every record, grouped |
| GitHub Pages + site Media | `docs/catalog.json` → `docs/media.html` |
| Vercel (`resadzacina.com`) | same `docs/` folder — connect this repo, output `docs` |

YouTube and X on Media stay as they are. Homepage copy, design, and other pages are not edited to add mentions — add a record here instead.

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
