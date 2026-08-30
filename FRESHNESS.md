# How this stays fresh

Public material does not live as one-off bullets. It lives in [`data/catalog.json`](data/catalog.json) — one record per article, podcast, video, talk, or post.

That file is the pipeline for **this GitHub profile**. The personal site is a different repo (Vercel). To expand Media there without changing design, use [`site-media/`](site-media/).

- **Topics** are the glue. A 2016 Medium essay and a 2026 LinkedIn note on spec-driven work sit on the same thread.
- **Types** (`writing`, `press`, `podcast`, `video`, `talk`, `post`) let people enter from the format they actually consume.
- **Related** links bind a podcast to its YouTube cut, or an interview to the essay it came from.
- **Watched feeds** (Medium, MOP blog) are scanned weekly by [`.github/workflows/refresh.yml`](.github/workflows/refresh.yml). New URLs get appended; this README and [ARCHIVE.md](ARCHIVE.md) refresh from the same file.
- Anything the scanner cannot see — a conference talk, a paywalled interview, a YouTube short — is one object away: add it to the catalog.

```txt
scan the web → catalog.json → README + ARCHIVE.md
```
