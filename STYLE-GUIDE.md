# Digital Envisioned — Brand Kit v1.0 (style guide)

## Files (deploy the folder as `/de-brand/` on each site, or once on digitalenvisioned.net and link absolutely)
| File | Size (gzip) | Purpose |
|---|---|---|
| de-brand.css | ~3.9 KB | Tokens, base type, buttons, cards, hologram glass, header, footer, forms, hero, reveal, reduced-motion |
| de-brand.js | ~3.9 KB | Non-destructive header/footer inject, FTC affiliate rel, scroll reveal, 3D tilt, particle hero, lazy 3D loader |
| de-hero3d.js | ~1.4 KB | ES module, only fetched for `.de-hero[data-3d]` when visible on a capable device |
| vendor/three.min.js | ~149 KB | three.js r149 (MIT), lazy, never on first load |
| includes/ | — | de-head.html, de-header.html/.php, de-footer.html/.php |
| demo.html | — | All components on one page |
Added JS on every page: **~3.9 KB gz** (budget 60 KB). 3D is extra and lazy.

## Tokens
- Background `#070B14` (navy); surfaces `#0F1729` / `#141E33`
- Accent gold `#F59E0B` (hover `#FBBF24`); text on gold `#1A1205`
- Text `#F8FAFC`, secondary `#CBD5E1`, muted `#94A3B8`
- Hologram tint cyan `#22D3EE` — decoration only, never body text
- Font: Inter if the site already loads it, else system stack. One family only. No webfont is downloaded by the kit.
- Radius 8/14/22; spacing 4-8-12-16-24-32-48-72; max width 1120px

## Rules
- Header: DE mark + "Digital Envisioned" wordmark + `/ Site name`. Under 400px only the mark + site name show.
- Footer (exact): **Digital Envisioned · Founded by Joshua Newton · PO Box 3063, Montgomery, AL 36109 · 205-578-8884** + Privacy `/legal/privacy/`, Terms `/legal/terms/`, Refunds `/legal/refunds/`; affiliate sites add the disclosure line + `/legal/affiliate-disclosure/`.
- Never a street address. Never the working title of the receptionist product. No site count ("18 websites") — say "a network of sites" or nothing.
- Mobile-first at 360px; every tap target ≥ 48px; inputs 16px; contrast ≥ 4.5:1 (gold on navy = 8.9:1, near-white on navy = 18:1).
- Copy: no invented testimonials, user counts, revenue or income claims. Results-vary language near anything money-related. Affiliate links get `rel="sponsored nofollow"` (JS does this when `data-affiliate="1"`).

## Motion
- `.de-reveal` (+ `data-delay="1..3"`): fade/slide on scroll; opacity/transform only, so no layout shift.
- `.de-tilt` (`data-tilt="6"` max degrees): desktop/fine pointer only.
- `.de-holo`: glass + scanlines + shimmer band. Falls back to a solid tinted gradient without backdrop-filter.
- `.de-hero`: animated conic glow (CSS) + particle canvas (≤70 particles, DPR ≤1.5, pauses off-screen and in hidden tabs).
- `.de-hero[data-3d]`: lazy three.js hologram, only if visible + deviceMemory ≥ 4. Falls back to particles.
- `prefers-reduced-motion`, Save-Data, 2G, <3 GB RAM or <4 cores ⇒ `html.de-lite`: no canvas, no 3D, no shimmer, reveal shows instantly.
- Canvas/3D layers are `position:absolute` behind content: zero CLS.

## Rollout (per site — needs file write access)
1. Put `/de-brand/` in the site (or reference `https://digitalenvisioned.net/de-brand/`).
2. Paste `includes/de-head.html` into the shared `<head>` (template/header.php or each page), set `data-site`.
3. Either paste `de-header`/`de-footer` server-side (best: no shift) or let the JS inject them (`data-header="auto"`, `data-footer="replace"`).
4. Add `class="de"` to `<body>` only on pages being fully restyled; without it the kit only adds header/footer and opt-in classes, so existing layouts are untouched.
5. WordPress: enqueue the CSS/JS from a child theme or a small mu-plugin; do not edit the parent theme.
