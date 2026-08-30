# The ledger

`catalog.json` is the single source of truth for public material about Resad Zacina.

The GitHub profile README stays short. The [archive site](../docs/index.html) and the Latest strip are generated from this file.

## Add a record

Append an object to `items` (newest can go anywhere — the site sorts by `date`):

```json
{
  "id": "unique-kebab-id",
  "type": "writing",
  "title": "Title as published",
  "date": "2026-08-30",
  "url": "https://example.com/the-piece",
  "source": "Where it lived",
  "summary": "One or two sentences. No marketing voice.",
  "topics": ["ai", "venture-building"],
  "related": ["optional-other-item-id"]
}
```

`type` must be one of: `writing`, `press`, `podcast`, `video`, `talk`, `post`.

`topics` should reuse ids from the `topics` array so old essays and new clips land on the same thread.

Then run:

```bash
node scripts/build.mjs
```

That copies the catalog into `docs/` and refreshes the Latest block in the README.

## Let the scanner do it

Watched feeds live under `sources`. The weekly workflow runs `scripts/scan.mjs`, which pulls RSS, skips URLs already in the catalog, and tags new items from the title.

Manual records still win for talks, paywalled press, and anything without a feed.
