# Arkansas Campaign Data Cooperative

Astro static site for Arkansas campaign infrastructure.

- Platform: [Electd](https://www.electd.io/)
- Enhanced data: [L2 Data](https://l2-data.com/)
- Live: https://outreach-ar.netlify.app

## Stack

- **Astro 7** (`output: 'static'`) → Netlify publish `dist`
- Shared `BaseLayout` + Header / Footer / Subnav (no DOM injection)
- Self-hosted fonts (`@fontsource` latin subsets) + optimized partner images (`astro:assets`)
- View Transitions (`ClientRouter`), Cmd/Ctrl+K command palette
- JSON-LD: Organization, WebSite, WebPage, Offer/Product, FAQPage
- Netlify Forms: `cooperative-interest` on `/join/`

## Routes

| Path | Purpose |
|------|---------|
| `/` | Executive landing + Arkansas map brand mark |
| `/data/` | L2 field architecture |
| `/models/` | HaystaqDNA models |
| `/cooperative/` | Contribution minimums + metro 50k rule |
| `/platform/` | Electd $149/mo |
| `/managed/` · `/pricing/` | Outreach rates |
| `/problem/` · `/van/` · `/privacy/` · `/how-it-works/` | Supporting briefs |
| `/join/` | Interest form |

## Develop

```bash
npm install
npm run dev
npm run build   # astro check && astro build
npm run preview
```

## Visual system

- Motion: staggered scroll reveals, hero rise, reduced-motion safe
- Type: optical size tokens, fewer all-caps labels
- Components: shared button / card / table language via CSS tokens
- Cinema sections: dark↔light problem → solution choreography
- Social: `/public/og/*.png` branded cards (regenerate with `npm run og`)


Targets (mobile Lighthouse on production): Performance / A11y / Best Practices / SEO ≥ 95; LCP &lt; 2.5s; CLS &lt; 0.1; INP &lt; 200ms.

### Bundle notes (post-build `dist/_astro`)

Typical ship shape after `npm run build`:

- One critical CSS chunk (~45KB) for tokens + layout + components
- Client JS limited to a small `BaseLayout` island (nav, reveals, form intent, command palette)
- Partner imagery emitted as WebP via Astro (Electd preview ~20KB optimized)
- Fonts: latin-only Bricolage + Source Sans 3 woff2; no Google Fonts request
- PDFs linked only (not preloaded): `/assets/L2-Voter-Data-Dictionary.pdf`, `/assets/L2-Haystaq-Model-List.pdf`

Re-check after changes:

```bash
npm run build
# inspect dist/_astro sizes; optional: npx lighthouse https://outreach-ar.netlify.app --view
```

## Assets

- `public/assets/arkansas-logo.svg` — AR outline + town pins
- `public/assets/L2-*.pdf` — L2 documentation
- `src/assets/partners/` — self-hosted Electd / L2 marks (with text attribution in copy)

## Deploy

Netlify site `outreach-ar` builds from `main`:

```toml
command = "npm run build"
publish = "dist"
```

Old `*.html` bookmarks redirect to clean trailing-slash routes.
