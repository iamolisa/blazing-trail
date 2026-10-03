# Blazing Trail Engineering — Frontend (Static Site)

Plain HTML, CSS and JS. No build step. Deploy this to **Hostinger** (or any
static host) — it talks to the Flask backend on Render entirely over
`fetch()`, so this folder only ever needs static file hosting.

## Analytics, Search Console & Meta Pixel

All three are wired up but **off by default** — nothing loads or tracks
anything until you fill in the relevant ID in `js/config.js`:

```js
ANALYTICS: {
  GA4_MEASUREMENT_ID: 'G-XXXXXXXXXX',   // GA4 Admin > Data Streams > your stream
  META_PIXEL_ID: '1234567890123456',     // Events Manager > your Pixel
  GSC_VERIFICATION: 'abc123...',          // Search Console > HTML tag method, content= value only
},
```

Leave any of the three blank and that integration simply doesn't load —
`js/analytics.js` checks each independently, so you can turn on GA4
without Meta Pixel, or vice versa. All 14 public pages already load
`js/analytics.js` (admin pages deliberately don't — no reason to track
your own dashboard usage).

Every real conversion point on the site — contact form, quote form,
testimonial submission, sizing calculator lead capture, and the
financing advisor (when a phone number is given) — already fires a
`generate_lead` GA4 event and a `Lead` Meta Pixel event on success, via
`window.BTE_ANALYTICS.trackLead(source)`. You don't need to wire this up
per-page; it's already in every form handler.

For Search Console, the HTML-tag method above is the quickest if you
just want this site verified. If you'll also want email forwarding,
subdomains, or other services under the same domain later, a DNS TXT
record verified at the registrar (Hostinger's DNS panel) verifies the
whole domain at once instead of just this one property — worth doing
that route instead if you're not sure yet.

## SEO: sitemap, robots.txt & structured data

`sitemap.xml` and `robots.txt` are at the root of this folder — upload
them to your domain root alongside the HTML files (so they end up at
`yourdomain.com/sitemap.xml` and `yourdomain.com/robots.txt`). Both
currently reference the placeholder domain `blazingtrailengineering.com`
— **update every `<loc>` in sitemap.xml and the `Sitemap:` line in
robots.txt once your real domain is confirmed**, then submit the sitemap
URL in Google Search Console (Sitemaps → Add a new sitemap).

Every public page (not admin) has `LocalBusiness` structured data
(JSON-LD) hardcoded directly in its `<head>` — business name, phone,
email, and service area. This is deliberately static HTML, not injected
by JavaScript, because some crawlers (social preview bots, some SEO
tools) don't execute JS at all.

**Worth knowing:** this site's actual page *content* (everything inside
`#page-content`) is rendered client-side — each page fetches data and
builds its HTML after load, rather than shipping full content in the
initial HTML response. Google generally renders JavaScript before
indexing, but with extra latency and crawl-budget cost compared to
server-rendered content; other consumers (LinkedIn/X link previews,
some AI search crawlers, Bing in some configurations) may not render
JS at all and would see only the `<head>` metadata plus a brief "Loading…"
placeholder. The `<head>` meta/JSON-LD on each page is written to stand
on its own for exactly this reason. If organic search and link-preview
quality end up mattering more than expected, the real fix is
pre-rendering or server-side rendering the page content — a larger
change than fits in a static-hosting-on-Hostinger setup, worth
revisiting if/when it matters.

## Before you upload: set your API URL

Open `js/config.js` and update this line with your actual Render URL once
the backend is deployed:

```js
return 'https://blazingtrail-api.onrender.com/api';
```

Change `blazingtrail-api.onrender.com` to whatever your Render service is
actually called. Everything else in this file can stay as-is — it already
auto-detects `localhost` for local testing.

## Uploading to Hostinger

1. Zip the **contents** of this folder (not the folder itself) or just
   upload everything as-is via File Manager / FTP into `public_html`.
2. Make sure `index.html` ends up directly inside `public_html` (not
   `public_html/frontend/index.html`).
3. That's it — no PHP, no build, no dependencies. Hostinger just serves
   the files.

## Local testing

```
python -m http.server 8080
```
then visit `http://localhost:8080/index.html`. `config.js` will
automatically point at `http://localhost:5000/api`, so run the backend
locally alongside it (see backend/DEPLOY.md).

## Structure

- `index.html`, `about.html`, `services.html`, `solar.html`,
  `products.html`, `packages.html`, `gallery.html`, `testimonials.html`,
  `tools.html`, `contact.html`, `quote.html`, `privacy.html`,
  `terms.html`, `404.html` — one file per page. `services.html?slug=x`
  and `products.html?slug=x` handle detail views; `products.html?category=x`
  and `gallery.html?category=x` filter by category.
- `admin/` — the content dashboard (login, dashboard, products CRUD,
  leads, settings). Token-authenticated against the backend; token is
  kept in `localStorage`, expires after 12 hours.
- `js/config.js` — the one file to edit when deploying (API base URL,
  plus optional analytics IDs — see above).
- `js/analytics.js` — GA4 / Meta Pixel / Search Console loader, driven
  entirely by `js/config.js`.
- `js/api.js` — thin fetch wrapper used by every page.
- `js/shell.js` — shared navbar/footer + page interactions (scroll
  effects, reveal animations, mobile nav, etc.), ported from the original
  Flask app's `main.js`.
- `js/pages/*.js` — one renderer per public page.
- `js/admin/admin-shell.js` — admin sidebar + auth guard, used by every
  page under `admin/`.
- `css/main.css`, `css/admin.css` — unchanged from the original app;
  no styling was rewritten, only how content gets into the page.

## Admin panel

Visit `/admin/login.html`. Seeded login is
`admin@blazingtrailengineering.com` / `ChangeMe123!` — **change this via
`/admin/settings.html` immediately after your first login** (see
backend/DEPLOY.md).

## CORS

If you ever see "blocked by CORS policy" errors in the browser console
after deploying, it means the backend's `CORS_ORIGINS` environment
variable on Render doesn't include your actual Hostinger domain. Update it
there — nothing to change on this side.
