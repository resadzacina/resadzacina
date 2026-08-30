# Media catalog

`catalog.json` is the single pipeline for public material about Resad Zacina.

It feeds both:

- the GitHub profile README (Latest + Writing / Press / Talks lists)
- the extra sections on the original Media page (`docs/media.html`): Articles, Press, Podcasts, Talks, More video, Posts

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
node scripts/build.mjs
```

Weekly scan of watched feeds: `node scripts/scan.mjs`.
