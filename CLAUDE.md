# CLAUDE.md

Static website for Via Federico's Photography (Yuma, Arizona), deployed on Vercel. No build step, no backend, no database.

## Layout
- Pages: `index`, `about`, `services`, `portfolio`, `pricing`, `booking`, `contact`, plus legal pages `privacy`, `terms`, `cookies`, `accessibility` (all `.html`).
- `site.css` (all styles, mostly appended at the end), `site.js` (nav, carousels, filters, tabs), `consent.js` (cookie consent).
- `fonts/` self-hosted Cormorant Garamond and Jost (latin subset). Do not re-add Google Fonts links.
- `vercel.json` security headers and CSP. `.vercelignore` keeps `.git`, `.vscode`, `README.md` from being published.
- `.well-known/security.txt`, `robots.txt`, `sitemap.xml` (add new pages to the sitemap).

## Conventions
- Header, footer and mobile menu are copy-pasted into every page. A change to them must be made in all 11 pages (the legal pages were generated from `contact.html`).
- Every footer carries the legal links and a `data-cookie-settings` button. Keep them when editing footers.
- Every page needs the skip link, `<main id="main">` and `<script src="consent.js" defer>`.
- External links use `target="_blank" rel="noopener noreferrer"`.

## Privacy and consent rules
- Analytics (Vercel) and third-party iframes (Google Forms, Setmore) must load only after consent. Do not add `src` to those iframes directly: use `data-consent-src` (see `contact.html` and `booking.html`). Do not add an always-on analytics script.
- The CSP in `vercel.json` has no inline-script allowance and no third-party scripts. Any new third-party service needs a CSP update, a mention in `privacy.html` and `cookies.html`, and consent gating.
- Choice is stored in localStorage key `vfp-consent-v1`. Global Privacy Control keeps analytics off.

## Business facts used in the copy and legal pages
- Contact: Viafedericophotography@gmail.com. Owner: Joseph (Joe) Federico, Yuma, AZ.
- 50% non-refundable deposit, balance due on session day, delivery in 1 to 2 weeks, travel included within 40 miles, first five sessions complimentary.
- If these change, update `pricing.html`, `booking.html`, `terms.html` and the offer text on `services.html` and `contact.html`.

## Open items
- `terms.html` and `privacy.html` were drafted by Claude, not a lawyer. Some terms are proposals (14-day image-use opt-out, refund if the photographer cancels, liability cap, Yuma County venue).
- Canonical domain is `viafedericosphotography.com` (with an "s"); Setmore and email use `viafedericophotography`. Confirm which is correct.
- `portfolio.html` still shows grey placeholder tiles.
- Muted grey text (`--stone`) may fail WCAG AA contrast.

## Local preview
`python -m http.server 8000`, then open http://localhost:8000. Security headers only apply when deployed on Vercel.
