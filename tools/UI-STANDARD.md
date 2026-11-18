# Shopno Kuthir — UI standard (every screen follows this)

1. **Summary list** — one table per screen, single-line fixed-height rows (48px), wide columns, horizontal scroll on phone, alternate row colours, +/− sign convention (+ = বেশি জমা/অগ্রিম, − = বকেয়া).
2. **Details list** — every row and every total row is clickable and opens a popup whose main content is a **table** (never paragraph steps). Only the clicked line's own details; if none exist say so in one line.
3. **List view + Single view** — every popup has ☰ গ্রিড ভিউ / ▭ সিঙ্গেল ভিউ (one entry at a time, prev/next, notes last).
4. **Hand-worked block (last)** — where a figure needs explaining, the `.chalk` block at the very end: aligned amounts with + − = and a rule line, like working on paper.
5. **Export bar on every screen and popup** — Excel · PDF (portrait/landscape) · ছবি (image) · WhatsApp (native share sheet on the APK; Web Share with file, else wa.me text). Attachments (PDFs) get Download + WhatsApp.
6. **Phases** — wherever old + new data exist: ধাপ ১ ROOF, ধাপ ২ FINISHING, each with its summary, then Grand total.
7. **Exempt**: data-entry forms (en-*), settings, embedded old pages.

Validate: `node tools/ui-audit.js` (Playwright against the built site) prints gaps per screen.
