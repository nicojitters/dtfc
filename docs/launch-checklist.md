# DT:FC Launch Checklist

Pre-flight ops document. Walk through each section top-to-bottom before flipping the site to production. Every item is pass/fail — no code, just verification.

**Owner:** solo dev (Cameron).
**Assumes:** Cycle 7 (launch-prep) has shipped and merged to main. Cycle 8 (flip-the-chips) is what this checklist unblocks.

---

## Content (client-dependent)

- [ ] Real support email decided. Update `SITE_CONFIG.fallbackContactEmail` in `src/lib/site-config.ts`.
- [ ] Real production domain decided (e.g. `https://dtfc.org`). Set `PUBLIC_SITE_URL` in the Vercel dashboard — this single env var now drives canonical, og:url, og:image, sitemap URL, and robots.txt simultaneously.
- [ ] Real Zeffy donation URL provided. Swap the mailto: CTA in `src/pages/community/donate.astro` to the Zeffy link. Remove the "coming soon" chip.
- [ ] Ask Shakespeare destination email configured — either populate the Formspree endpoint's dashboard destination OR (if migrating off Formspree) swap the form action URL. Remove the CLIENT REVIEW comment from `src/components/shakespeare/AskShakespeareForm.astro`.
- [ ] Membership tiers + pricing content finalized. Expand `src/pages/community/membership.astro` with real tier content. Remove the pre-release chip.
- [ ] Testimonials moderation policy decided (dev-committed data file vs CMS backend). If staying dev-committed, no action needed — new testimonials arrive via commits.
- [ ] Desirae's real favicon delivered. Replace `public/favicon.*` files. Verify `<link rel="icon">` renders correctly.
- [ ] Desirae's real OG image delivered. Replace `public/og-default.png` with a real 1200×630 PNG. Verify `<meta property="og:image">` resolves to a live URL.
- [ ] Desirae's real DT:FC logo delivered. Replace `public/DTFC-logo.png` (currently a placeholder used in the header + OG).

## Envelope (Vercel production dashboard)

- [ ] `PUBLIC_FORMSPREE_NEWSLETTER_ID` set to the real Formspree endpoint ID.
- [ ] `PUBLIC_FORMSPREE_ASK_SHAKESPEARE_ID` set.
- [ ] `PUBLIC_FORMSPREE_TESTIMONIAL_ID` set.
- [ ] `PUBLIC_VERCEL_ANALYTICS_ENABLED` set to `true`.
- [ ] `PUBLIC_SITE_URL` set to the real production domain. This single env var drives canonical URL, og:url, og:image absolute URL, sitemap URL, and robots.txt — one change flips all five.

## SEO + meta

- [ ] Sitemap builds and reaches `<production-url>/sitemap-index.xml` (Vercel deploy → curl the URL).
- [ ] robots.txt allows all + references the sitemap URL. `curl <production-url>/robots.txt` — verify content.
- [ ] OG image is live: `curl -I <og-image-url>` returns 200 with `image/png` content-type.
- [ ] Canonical URL emits on every page. Spot-check a few: `curl <production-url>/legacy/ | grep canonical`.
- [ ] Favicon renders in the browser tab.
- [ ] `<title>` renders correctly on every route.
- [ ] Twitter Card preview looks right: paste a page URL into https://cards-dev.twitter.com/validator.
- [ ] Facebook / OG preview looks right: paste into https://developers.facebook.com/tools/debug.
- [ ] Canonical URL host matches production domain on a spot-checked page (open browser DevTools on a production page, verify `<link rel="canonical">`, `<meta property="og:url">`, and `<meta property="og:image">` all resolve to the real production hostname — no lingering `dtfc.example` placeholder).

## Forms (all 4 site forms POST successfully)

- [ ] Footer newsletter signup: submit a test email from production, verify it lands in the Formspree dashboard or configured destination.
- [ ] Landing newsletter tile: same test.
- [ ] Membership interest form (`/community/membership/`): submit, verify.
- [ ] Ask Shakespeare (`/shakespeare/ask-shakespeare/`): submit, verify.
- [ ] Testimonial form (`/community/testimonials/`): submit, verify.
- [ ] Donate CTA mailto: opens the mail client with the correct address populated.

## Accessibility

- [ ] `pnpm test:e2e` passes in CI (axe reports 0 critical/serious across 11+ pages).
- [ ] Manual keyboard-only pass through primary flows:
  - [ ] Tab through the header nav; verify focus visible on every element.
  - [ ] Tab into the search icon; press Enter; type; press Escape to close.
  - [ ] Tab into the Game Finder chip filter; toggle chips with keyboard.
  - [ ] Tab through the Timeline chip filter; toggle chips.
  - [ ] Submit each form with keyboard only.
- [ ] Screen reader spot-check (VoiceOver / NVDA):
  - [ ] Landing page announces the h1 + main sections.
  - [ ] Search modal announces its role + label on open.
  - [ ] Form success/error messages announce (they have role="status"/role="alert").
- [ ] Reduced-motion setting respected: enable OS reduced-motion, verify Timeline chip hover has no transition.

## Analytics

- [ ] First production visit lands a pageview in Vercel Analytics dashboard within 60 seconds.
- [ ] Speed Insights dashboard receives Core Web Vitals (LCP, INP, CLS) after a few pageviews.
- [ ] Client-privacy audit: verify no cookies set by Analytics/SpeedInsights (open DevTools → Application → Cookies on a production page; expect none from Vercel).

## Search

- [ ] Vercel build log shows Pagefind step ran and indexed N pages.
- [ ] `<production-url>/pagefind/pagefind.js` returns 200 (the client bundle is on the CDN).
- [ ] Header search icon opens the modal.
- [ ] ⌘K opens the modal from any page.
- [ ] Typing "shakespeare" returns at least one result.
- [ ] `<production-url>/search/` renders the full-page search interface.
- [ ] Clicking a result navigates to the correct page (spot-check 2-3).

## Domain + TLS

- [ ] DNS A/AAAA/CNAME records point at Vercel's IPs / CNAME target.
- [ ] HTTPS enforced — HTTP request to the domain 301s to HTTPS.
- [ ] TLS certificate valid (browser shows padlock; not expiring soon).
- [ ] No mixed content warnings in the DevTools console on any tested page.
- [ ] `www` subdomain redirect configured (or vice versa — pick a canonical host).
- [ ] Any legacy redirect map (if the client had a previous site) configured.

## Content QA

- [ ] Zero straight apostrophes in shipped content (`node scripts/check-prohibited-text.mjs` returns clean).
- [ ] Zero prohibited phrases (`Great Change`, `traditional work and ways`, `Childrens' Theatre`, etc. — same script).
- [ ] All CLIENT REVIEW comments in `src/` have been addressed by Lola/Laurie (grep `CLIENT REVIEW` across `src/`; each match should be triaged: keep with a note or resolve).
- [ ] No `TODO(esp)` markers remaining (grep `TODO(esp)` — should be 0 hits after Cycle 6).
- [ ] Broken-link scan: run `npx broken-link-checker <production-url> -ro` or similar against production; fix any broken internal links.

## Monitoring (recommended, not required)

- [ ] Uptime monitor configured (Vercel deploy notifications; optionally UptimeRobot / BetterUptime).
- [ ] Form-submission alerts configured (Formspree dashboard notifications OR ESP list-growth notifications).

## Sign-off

- [ ] Cameron: pre-launch tests passed on `<date>`.
- [ ] Lola / Laurie: content review passed on `<date>`.
- [ ] Client: given a preview URL for final sign-off before flipping DNS.

---

**Post-launch (Cycle 8 or ongoing):**
- Optional polish: seed 1 high-cohesion game in Theatre Games to eliminate the finder "High" empty state.
- Optional polish: fix `resilience.mdx` prose game references (Fire Tenders, Tignishes — games that don't exist).
- Optional polish: RSS feed for `/community/newsletters/` if client requests.
- Ongoing: as the client adds testimonials, commit them to `src/data/testimonials.ts` and deploy.
