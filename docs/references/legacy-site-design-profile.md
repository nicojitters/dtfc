# Legacy Site — Design Profile & Reference

**Source:** https://developmentaltheatre.net/ — the pre-launch WordPress splash site that predates this repo's build.
**Captured:** 2026-09-04 (raw HTML + `wp-content/uploads/fusion-styles/70baad6152d3402fc834ef95b10b110a.min.css`)
**Purpose:** Reference for any visual continuity the client wants preserved (colors, type, tone) as we ship the new Astro site. Not a spec to copy wholesale — the legacy site is a 3-page marketing splash on a stock commercial theme; most of the design decisions are theme defaults, not deliberate choices.

---

## 1. Build stack (legacy)

| Layer | Value |
| --- | --- |
| CMS | WordPress 6.8.8 |
| Theme | **Avada** (parent) + `Avada-Child-Theme` (empty — no overrides beyond the theme header) |
| Page builder | Avada Website Builder / Fusion 3.16.1 |
| Host | GoDaddy Managed WordPress (mu-plugin `godaddy-launch`) |
| CDN | Cloudflare |
| SEO plugin | Yoast |
| Icon fonts | FontAwesome 5 (Free + Brands), Avada's `awb-icons` |
| Web fonts | **Raleway** via Google Fonts (italic + roman, weights 600 / 700 / 800 / 900) |
| Fallback stacks | `"PT Sans", Arial, Helvetica, sans-serif` (rare — mostly the 404 page) and `"Helvetica Neue", Arial, Helvetica, sans-serif` (Leaflet + generic UI) |

The child theme's `style.css` contains only the WordPress theme-manifest header — zero real CSS overrides. Every design choice below comes from Avada theme options, saved into the Fusion dynamic CSS.

---

## 2. Color palette

Avada exposes 8 palette slots as CSS variables on `:root`. On the legacy site they are set to:

| Slot | Hex | HSL | Role in the theme options |
| --- | --- | --- | --- |
| `--awb-color1` | `#ffffff` | 0 0% 100% | Page background / on-dark text |
| `--awb-color2` | `#f9f9fb` | 240 20% 98% | Alt surface (testimonial bg, tabs inactive, scrollbar track) |
| `--awb-color3` | `#f2f3f5` | 220 13% 95% | Separators, form borders, gallery borders, menu hover |
| `--awb-color4` | `#209eaf` | 187 69% 41% | **Teal** — logo background, menu highlight, accent hover, checklist circle |
| `--awb-color5` | `#209eaf` | 187 69% 41% | **Teal** (duplicate of 4) — used as `--primary_color`, link color, focus border, progress bar |
| `--awb-color6` | `#434549` | 220 4% 27% | Dark gray — footer dividers, mobile menu toggle |
| `--awb-color7` | `#212326` | 216 7% 14% | Near-black — sliding-bar bg, countdown counter bg |
| `--awb-color8` | `#000000` | 0 0% 0% | True black — nav text, form text, icon border, button gradient |

### Semantic / status colors

| Token | Hex | Notes |
| --- | --- | --- |
| `--danger_accent_color` | `#db4b68` | Rose-red, used at 10% alpha bg |
| `--success_accent_color` | `#12b878` | Green, 10% alpha bg |
| `--warning_accent_color` | `#f1ae2a` | Amber, 10% alpha bg |
| Blockquote accent / active `h3 a` | `#65bc7b` | Soft green — hard-coded in a component rule, not exposed as a token |

### The color story, plainly

- The site is **effectively monochromatic teal on white** — one accent (`#209eaf`) does every job: primary buttons, links, headings, focus rings.
- Colors 4 and 5 are identical, so Avada's "primary" and "secondary accent" collapse into the same teal.
- Neutral scale is very tight: white → `#f9f9fb` → `#f2f3f5` → `#434549` → `#212326` → `#000000`. No warm-gray, no true mid-gray.
- **Every heading is teal `#209eaf`**, not a text color. This creates the site's dominant visual signature but also means headings never sit on a saturated background — everything is teal-on-white.
- Decorative homepage arrow illustrations widen the apparent palette (blue / fuchsia / purple / red swirls), but those live only as PNGs under `wp-content/uploads/2024/03/` — the CSS palette itself is teal-only.

---

## 3. Typography

**Family:** `Raleway, Arial, Helvetica, sans-serif` — used for body, all headings, buttons, nav. There is no serif face.

### Named typography scales (Avada exposes 5 + 1 custom)

| Token | Family | Size | Weight | Line height | Letter spacing |
| --- | --- | --- | --- | --- | --- |
| `typography1` | Raleway | 52px | 800 | 1.2 | 0.015em |
| `typography2` | Raleway | 32px | 700 | 1.1 | 0.015em |
| `typography3` | Raleway | 22px | 700 | 1.2 | 0.015em |
| `typography4` | Raleway | 18px | 600 | 1.72 | 0.015em |
| `typography5` | Raleway | 16px | 700 | 1.72 | 0.015em |
| `custom_typography_1` | Raleway | 13px | 700 | 1.5 | 0.015em |

`typography1` seeds the h1–h6 family/weight/leading. `typography4` seeds body. `typography3` seeds nav and mobile menu. `typography2` seeds footer headings.

### Heading scale (concrete values)

| Element | Size | Weight | Color | Margins |
| --- | --- | --- | --- | --- |
| `h1` | 52px | 800 | `#209eaf` | 0.67em top/bottom |
| `h2` | 42px | 800 | `#209eaf` | 0 top / 1.1em bottom |
| `h3` | 32px | 800 | `#209eaf` | 1em top/bottom |
| `h4` | 24px | 800 | `#209eaf` | 1.33em top/bottom |
| `h5` | 20px | 800 | `#209eaf` | 1.67em top/bottom |
| `h6` | 16px | 800 | `#209eaf` | 2.33em top/bottom |
| Post title | 48px | 800 | `#209eaf` | — |

Global letter-spacing on headings: `0.015em`. Line-height: `1.2`.

### Body

- Family: `Raleway, Arial, Helvetica, sans-serif`
- Size: **18px** (base-font-size: 18)
- Weight: 600
- Line height: 1.72
- Letter spacing: 0.015em
- Color: **`#209eaf`** — the theme option was left on teal, so paragraph copy renders teal against white. On any real content-heavy page this would be a legibility problem; the splash page hides it because there is very little paragraph text.

### Nav / mobile menu

- Uses `typography3` (Raleway 22px / 700)
- Color: `#000000`
- Highlight background: teal `#209eaf`

### Buttons

- Family: Raleway 800
- Padding: 13px 29px (compiled) / theme-option `11px 23px`
- Base gradient: `#000000 → #000000` (flat black)
- Hover gradient: `#209eaf → #209eaf` (flat teal)
- Text color: white on black, white on teal
- Border: none
- Radius: not set globally (Fusion buttons default to 0)

---

## 4. Layout tokens

| Token | Value |
| --- | --- |
| Site width | **1200px** (`--site_width`) |
| Grid main breakpoint | 1000px |
| Side header breakpoint | 800px |
| Content breakpoint | 800px |
| 100%-width section padding | 30px (left/right) |
| `#main` padding | 55px 10px 45px |
| Form input height | 50px |
| Form border radius | 6px |
| Blog archive column spacing | 40px |
| Related-posts columns | 4 (spacing 48px) |
| Column margin bottom | 20px |
| Column spacing | 4% |
| Pagination box | 30×30, radius 0 |

Layout mode from `<html>` classes: `avada-html-layout-wide`, `avada-html-header-position-top`, `avada-is-100-percent-template`, `fusion-header-layout-v3` (a specific Avada header variant — top row logo + bottom row menu, both centered).

---

## 5. Header, footer, chrome

- **Logo:** `/wp-content/uploads/2024/03/DTFCLogo-300x199.png` — served at 300×199. Sits on a `--logo_background_color: #209eaf` swatch (teal).
- **Logo alignment:** left.
- **Header:** sticky on desktop (`fusion-sticky-header`), not sticky on tablet/mobile.
- **Nav highlight:** 3px teal bar under the active/hover item; 200px dropdown width with 12px vertical padding on submenu items; 3px top border on dropdown menus.
- **Footer:**
  - Divider color: `#434549` (color6)
  - Body text: white at 60% alpha (`hsla(0 0% 100% / 60%)`)
  - Headings: white, using `typography2` (Raleway 32px / 700)
  - Background pattern option is available (`--bg_pattern` points at Avada's `pattern1.png`) but the site's `--bg_color` is `#000000`, so the footer/body backdrop is black.
- **Sliding bar** (mobile drawer): 300px wide, `#212326` background, dividers `#434549`.

---

## 6. Decorative assets on the homepage

Nine hand-drawn arrow/swirl PNGs live under `/wp-content/uploads/2024/03/`. These carry the site's warmth — the theme itself is austere teal-and-black.

- `blue-arrow-southwest.png`
- `blue-arrow-east.png`
- `blue-arrow-swirl-south.png`
- `fuschia-arrow-swirl.png` *(sic — legacy misspelling of "fuchsia")*
- `purple-arrow-southwest.png`
- `purple-arrow-east.png`
- `purple-arrow-west.png`
- `red-arrow-swirl-east.png`
- `DTFC_icon-e1710423913689.png`

If we want to visually reference the old site, these arrows are the recognizable element — not the teal.

---

## 7. Site structure (all of it)

The full sitemap (`page-sitemap.xml`) contains exactly three URLs:

1. `/` — "Help Us Bring DT:FC Online" splash with contributor blocks + video-embed placeholders + "Say Yes! And..." CTA
2. `/theatre-games/`
3. `/donate/`

There is a post-sitemap referenced but no visible article grid on the site chrome. The legacy site is best understood as a **fundraising splash**, not a content site — treat it as tone reference, not IA reference.

---

## 8. Design profile — what to carry into the new build

Read this in the context of `src/styles/tokens.css`, which is the source of truth for our new site.

### Worth preserving

- **Teal `#209eaf` as an anchor color.** Recognizable, and the client has been living with it for two years. If we want visual continuity, keep this hue in the palette (as accent or a secondary — not as body text). The `oklch()` conversion is roughly `oklch(0.63 0.09 210)`.
- **Raleway as a typographic touchstone.** If a display face is wanted, Raleway 800 for headings would echo the old site directly. Body copy in Raleway at 18/1.72 was legible enough — the size and leading are fine.
- **Hand-drawn arrow decorations.** These are the most distinctive thing on the old site. If Desirae ever needs a "callback" element, these are it. Files are downloadable from the URLs above.
- **1200px content max-width** — sensible, matches typical modern reading widths.

### Worth rejecting

- **Teal on white body text.** Fails contrast for long-form copy. New site uses proper text tokens; do not repeat.
- **Teal on every heading level.** Flattens the hierarchy — h1 and h6 look interchangeable. The new site should let heading color follow the surface, not the accent.
- **Duplicate primary/secondary accents.** Color4 and Color5 are identical, so there is no real secondary. Our tokens support a proper duo.
- **Buttons as flat black boxes.** Reads as generic Avada. Our button styles already differ.
- **Avada / Fusion as a mental model.** The old site is a page-builder assembly; ours is a content-collection-driven Astro site. Do not port Fusion's typography-scale sprawl (5 named scales + heading overrides + section overrides) — our tokens already collapse this to a smaller, saner set.

### Open questions for the client

- Is the teal `#209eaf` a **brand color** that predates the website (worth preserving) or just a theme default someone picked in 2024 (worth reconsidering)?
- Are the arrow illustrations original artwork (keep) or stock (drop)? Filenames suggest they were dropped in during a specific March 2024 upload session.
- Does the DT:FC visual identity include a formal typeface pairing beyond Raleway, or has Raleway been the whole system?

---

## 9. How to regenerate this doc

```
curl -sSL https://developmentaltheatre.net/ -o /tmp/dt-home.html
curl -sSL "https://developmentaltheatre.net/wp-content/uploads/fusion-styles/70baad6152d3402fc834ef95b10b110a.min.css?ver=3.16.1" -o /tmp/dt-fusion.css
```

The Fusion filename hash may rotate if the client tweaks theme options — grep `<link[^>]+fusion-dynamic-css` in the homepage HTML to find the current URL. All the design tokens above live inside a single giant `:root { ... }` block at the top of that file.
