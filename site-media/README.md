# Handoff for the Vercel website repo

This GitHub profile repo is the archive. It is not the live site.

To expand Media on resadzacina.com without changing design:

1. Copy `media-catalog.js` → `js/media-catalog.js` in the website repo
2. Copy `media-catalog.css` → `css/media-catalog.css`
3. Copy `catalog.json` next to `media.html` (or keep it in sync with `../data/catalog.json`)
4. In `media.html`, leave YouTube and X as they are
5. Paste the sections from `media-sections.html` after the X block
6. Add before `</head>`: `<link rel="stylesheet" href="css/media-catalog.css">`
7. Add before `</body>`: `<script src="js/media-catalog.js"></script>`

Do not copy `index.html` or the rest of the site from this repo.
