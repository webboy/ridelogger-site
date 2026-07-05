# Architecture — ridelogger-site

**Last verified:** 2026-07-04

> Ecosystem-level documentation: `~/sk/memory/docs/`.
> Deployment is documented authoritatively in [`docs/DEPLOY_PRODUCTION.md`](./DEPLOY_PRODUCTION.md) — this file does not duplicate it.

## Overview

`ridelogger-site` is the public **static marketing site** for the RideLogger / Servisna Knjižica ecosystem. It is a plain **Astro 6** project (no framework integrations, no SSR adapter, no CMS) that outputs static HTML + a small amount of inline/bundled client-side JavaScript for locale switching, cookie consent, and campaign analytics.

| Property | Value |
|---|---|
| Framework | Astro `^6.1.2` (`astro.config.mjs`, `trailingSlash: 'always'`) |
| Language | TypeScript (`tsconfig.json`), `.astro` components |
| Node | `>= 22.12.0` (`package.json` → `engines`) |
| Runtime deps | `astro` only; dev dep `@playwright/test` |
| Output | Fully static `dist/` (`astro build`); no server-side rendering |
| Dev containers | `sk-site` (balkan, port 8086) and `sk-site-global` (global, port 8087) |
| Tests | Playwright smoke e2e against `astro preview` builds (see [E2E](#e2e-smoke-tests)) |

**One codebase, two production builds.** The same source tree is built twice with different `PUBLIC_*` env values:

| Instance | `PUBLIC_INSTANCE` | Domain | Brand | Default UI language |
|---|---|---|---|---|
| balkan | `balkan` (default when unset) | `www.servisna-knjizica.com` | Servisna Knjižica | sr-Latn |
| global | `global` | `www.ridelogger.com` | RideLogger | de (German) |

`package.json` provides `build:balkan` and `build:global` scripts that set `PUBLIC_INSTANCE`, `PUBLIC_SITE_URL`, and `PUBLIC_APP_URL` inline.

## Directory layout

| Path | Purpose |
|---|---|
| `src/pages/` | Astro file-based routing (root picker, `404`, `[country]/…` dynamic routes) |
| `src/config/` | Instance/country config (`countries.ts`) and public URL/CTA config (`public.ts`) |
| `src/i18n/` | Locale registry (`config.ts`), message loaders, campaign/MCP copy |
| `src/i18n/messages/home/` | Homepage copy, one JSON per locale (12 files) |
| `src/i18n/messages/autoSeller/` | Campaign landing copy, one JSON per brand×locale×segment (21 files) |
| `src/data/legal/` | Legal content (privacy, ToS, cookie policy, cookie banner) — one JSON per locale |
| `src/components/` | Header, footer, language switcher, cookie banner, home/campaign/legal/MCP sections |
| `src/layouts/SiteLayout.astro` | Shared page shell (head/meta/canonical, header, footer, cookie banner, locale script) |
| `src/scripts/marketingLocale.ts` | Client-side locale switching engine (bundled, not inline) |
| `src/types/` | TS shapes for message bundles (`home.ts`, `autoSellerLanding.ts`, `managedDealerLanding.ts`, `mcpPage.ts`) |
| `src/utils/` | Legal HTML renderers, Google Play badge helper, `:privacy_url` placeholder replacement |
| `src/styles/global.css` | Single global stylesheet |
| `public/` | Static assets: flags, Google Play badges, marketing images, PWA screenshots, favicon |
| `e2e/` | Playwright smoke specs (one per instance) |
| `deploy/` | Apache vhost samples for `ridelogger.com` |
| `docs/DEPLOY_PRODUCTION.md` | **Authoritative** production deploy guide |
| `media/` | Gitignored working area for generated/reference images |

## Routing model

Astro file-based routing with `getStaticPaths()` per page. All country pages live under a single `[country]` dynamic segment.

| Route | Source file | Built for instance |
|---|---|---|
| `/` | `src/pages/index.astro` | both (content differs per instance) |
| `/404` | `src/pages/404.astro` | both (meta-refresh redirect to `/`) |
| `/{country}/` | `src/pages/[country]/index.astro` | both (own countries only) |
| `/{country}/privacy/`, `/terms/`, `/cookies/` | `src/pages/[country]/{privacy,terms,cookies}.astro` | both (own countries only) |
| `/{country}/mcp/` | `src/pages/[country]/mcp.astro` | both (own countries only) |
| `/{country}/private-sellers/`, `/auto-dealers/`, `/auto-dealers/managed/` | `src/pages/[country]/private-sellers.astro`, `auto-dealers.astro`, `auto-dealers/managed.astro` | **global only** |
| `/{country}/prodaja-auta/`, `/auto-placevi/`, `/auto-placevi/managed/` | `src/pages/[country]/prodaja-auta.astro`, `auto-placevi.astro`, `auto-placevi/managed.astro` | **balkan only** |

### How `getStaticPaths` works per instance

Every `[country]` page uses the same pattern:

```7:10:src/pages/[country]/index.astro
export function getStaticPaths() {
	const inst = (import.meta.env.PUBLIC_INSTANCE || 'balkan') as DeployInstance;
	return countryPagesForInstance(inst).map((c) => ({ params: { country: c.path } }));
}
```

- **Instance-shared pages** (home, legal, mcp) emit one static page per country belonging to the current `PUBLIC_INSTANCE`.
- **Campaign pages** additionally guard the instance and return `[]` for the wrong build (e.g. `private-sellers.astro` has `if (inst !== 'global') return [];`), so global campaign URLs simply do not exist in the balkan `dist/` and vice versa.
- Each page body resolves `Astro.params.country` via `getCountryByPath()` and throws on unknown values (build-time safety, cannot happen for generated paths).

### Root country picker (`src/pages/index.astro`)

The root page is a standalone document (does not use `SiteLayout`). It renders **two country groups** — "RideLogger.com" (global countries) and "servisna-knjizica.com" (balkan countries) — over a Europe-map panel:

- Countries in the **current** instance link relatively to `{selfOrigin}/{path}/`; countries in the **other** instance link cross-domain to `peerMarketingOrigin(selfOrigin)` (see below). Both instances therefore show all 12 countries, cross-linking SK↔RL.
- Instance detection: `PUBLIC_INSTANCE` first, fallback heuristic on whether `Astro.site` origin contains `ridelogger`.
- Balkan picker labels countries in sr-Latn; global picker uses each country's own default-locale name. Sorting is locale-aware (`localeCompare`).
- An inline script stores the last clicked country in `localStorage` (`sk_marketing_last_country`) and highlights it on return visits.
- Footer contains a language switcher, privacy/cookies links (pointing to `/sr/…` on balkan, `/de/…` on global), and the cookie banner.

### `404.astro`

Static 404 with `<meta http-equiv="refresh">` back to the country picker plus a manual link; includes the cookie banner. `countryPath`/`locale` default per instance (`sr`/`sr-latn` vs `de`/`de`).

## Instance system

### `src/config/countries.ts`

The single source of truth for country routes. `COUNTRY_PAGES: CountryPageConfig[]` — 12 entries:

| `path` | `flagCode` | `instance` | `defaultLocale` | `campaignLocale` |
|---|---|---|---|---|
| `sr` | `rs` | balkan | `sr-latn` | — |
| `hr` | `hr` | balkan | `hr` | — |
| `ba` | `ba` | balkan | `sr-latn` | — |
| `me` | `me` | balkan | `sr-latn` | — |
| `mk` | `mk` | balkan | `mk` | — |
| `de` | `de` | global | `de` | — |
| `fr` | `fr` | global | `fr` | — |
| `it` | `it` | global | `it` | — |
| `ch` | `ch` | global | `de` | — |
| `at` | `at` | global | `de` | — |
| `si` | `si` | global | `sl` | — |
| `us` | `us` | global | `en` | `de` |

Each entry also carries `names` — the country's display name in 11 languages (used by the picker and language-aware UI).

Key helpers:

| Function | Behavior |
|---|---|
| `countryPagesForInstance(instance)` | Filter for `getStaticPaths` |
| `getCountryByPath(path)` | Lookup by URL segment |
| `campaignLocaleForCountry(cfg)` | `campaignLocale ?? defaultLocale` — used by **global** campaign pages so `us` (default `en`, no English campaign copy) renders campaigns in German |
| `appCountryCodeFromPath(path)` | Uppercased `flagCode` as ISO 3166-1 alpha-2 for the PWA `?country=` param (matches API `countries.code`) |
| `peerMarketingOrigin(selfOrigin)` | Cross-domain origin of the *other* instance: a `servisna-knjizica` host ⇒ `https://www.ridelogger.com`, anything else ⇒ `https://www.servisna-knjizica.com` |

### `src/config/public.ts` — CTA / URL config

| Function | Behavior |
|---|---|
| `getAppUrl(locale, countryCode?)` | User PWA entry URL from `PUBLIC_APP_URL` (fallback `https://app.servisna-knjizica.com`) with `?lang=<BCP-47 tag>` (`LOCALE_HREFLANG`, e.g. `sr-Latn`, `de`) and optional `&country=<ISO>` (e.g. `RS`, `DE`). The PWA reads both at boot. |
| `mergeMarketingParams(href, params)` | Copies `utm_*`, `gclid`, `fbclid` from a source query string onto a target URL without clobbering existing keys |
| `getAppUrlWithMarketing(...)` | Composition of the above two |
| `getDealerBonusInquiryUrl()` | `PUBLIC_DEALER_BONUS_INQUIRY_URL` (mailto or https form) or `null`; when `null` the dealer-offer CTA renders disabled |
| `getManagedDealerInquiryUrl()` | `PUBLIC_MANAGED_DEALER_INQUIRY_URL`, falling back to the dealer bonus URL so managed CTAs stay usable in dev |
| `getPartnerAppUrl()` | `PUBLIC_PARTNER_APP_URL` or instance default: `https://partner.ridelogger.com` (global) / `https://partner.servisna-knjizica.com` (balkan) |

## i18n system

### Locales (`src/i18n/config.ts`)

**12 locales:** `sr-latn`, `sr-cyrl`, `hr`, `de`, `en`, `mk`, `fr`, `it`, `sl`, `tr`, `uk`, `pl`.

Supporting maps: `LOCALE_LABELS` (native names), `LOCALE_SHORT` (2-letter labels), `LOCALE_FLAG` (flag SVG stems in `public/flags/`), `LOCALE_HREFLANG` (BCP-47 tags, also used for the PWA `?lang=` param). `brandName(locale)` returns "Servisna Knjižica" for `sr-latn`/`sr-cyrl`/`hr`/`mk` and "RideLogger" otherwise — the visible brand follows the **language**, not the deployed instance. `DEFAULT_LOCALE` is documented in-code as legacy/unused for routing.

### String organization

| Domain | Where | Loader | Notes |
|---|---|---|---|
| Home / shared UI (`nav`, `hero`, `trust`, `problem`, `how`, `features`, `showcase`, `security`, `testimonials`, `cta`, `landing`, `footer`) | `src/i18n/messages/home/<locale>.json` (12 files) | `src/i18n/loadHome.ts` (`getHomeMessages`, `getAllHomeMessages`) | Shape: `src/types/home.ts` |
| Legal (privacy v2, ToS, cookie policy, cookie banner, footer strings) | `src/data/legal/<locale>.json` (12 files) | `src/i18n/loadLegal.ts` (`getLegal`, `getAllLegal`) | Contains pre-rendered HTML fragments; type inferred from `en.json` |
| Campaign copy (private/dealers) | `src/i18n/messages/autoSeller/{sk,rl}-<lang>-{private,dealers}.json` | `src/i18n/autoSellerCampaigns.ts` | SK: sr-latn/hr/mk; RL: de/fr/it/sl. `pick()` **throws** at build time if copy is missing for a locale |
| Campaign copy (managed dealers) | `src/i18n/messages/autoSeller/{sk,rl}-<lang>-managed-dealers.json` | `src/i18n/managedDealerCampaigns.ts` | Same locale coverage as above |
| MCP page | inline constants in `src/i18n/mcpPage.ts` (EN/DE/SR_LATN/HR/MK/FR/IT/SL; `sr-cyrl`→SR_LATN, `tr`/`uk`/`pl`→EN) | same file | No JSON files; TS objects with spread-based fallbacks |
| `?lang=` mapping | `src/i18n/langFromQuery.ts` | — | Normalizes BCP-47 / short ids (`sr`→`sr-latn`) to a site locale |

### Client-side locale switching

Pages are **statically rendered in the country's default locale**, then re-localized in the browser without navigation:

- `src/scripts/marketingLocale.ts` (`initMarketingLocale`) is fed a JSON init object by `src/components/HomeLocaleScript.astro` (country pages) or `LandingLocaleScript.astro` (root picker).
- Locale resolution priority: `?lang=` query param → `localStorage` key `marketing_ui_locale_<countryPath|landing>__<instance>` (prefs isolated per deploy) → the page's default locale.
- On apply, it rewrites: all `[data-hk]` text nodes and `[data-hk-alt]` alt attributes from the home bundle; `[data-app-link]` hrefs (regenerating `?lang`/`?country`); `[data-brand-text]` / `[data-brand-line]` brand strings; Google Play badge images; `<html lang>`; document title/description (unless `lockMarketingSeo` — campaign pages keep their SSR SEO); and, on legal pages, replaces the whole article via the shared HTML renderers.
- `LanguageSwitcherCountry.astro` renders the `<details>` dropdown; its buttons carry `data-locale-pick` handled by the same script. The MCP page has its own smaller inline hydrator using `data-mcp-key` attributes and the same storage key.

## Legal content pipeline

1. Per-locale JSON bundles in `src/data/legal/` with top-level keys `footer`, `cookie_banner`, `privacy_v2`, `cookie_policy`, `tos`. Bodies are flat keyed strings (e.g. `privacy_v2.s1_title`, `s3_cat1_title`, …) plus some HTML fragments (`tos.content_html`).
2. Shared renderers in `src/utils/` build the article HTML **once for SSR and once for client-side locale switching**: `renderPrivacyArticleHtml.ts`, `renderTosArticleHtml.ts`, `renderCookieArticleHtml.ts`. `legalReplace.ts` substitutes legacy `:privacy_url` placeholders (inherited from Laravel route injection) with the country's canonical privacy URL.
3. Thin Astro wrappers `src/components/legal/{PrivacyArticle,TosArticle,CookieArticle}.astro` just `set:html` the renderer output.
4. Pages `[country]/{privacy,terms,cookies}.astro` pass `legalPage` + all legal bundles into `SiteLayout` so `marketingLocale.ts` can swap the article and SEO meta when the visitor changes language.

## Component inventory

| Component | Role |
|---|---|
| `layouts/SiteLayout.astro` | Page shell for all `[country]` pages: canonical URL (from `Astro.site` + `countryPath` + `pathSuffix`), OG/Twitter meta, `SiteHeader`, `SiteFooter`, `CookieBanner`, optional `HomeLocaleScript`. Props control header variant, app CTA href override, legal-page mode, and `lockMarketingSeo` |
| `SiteHeader.astro` | Brand link, Partner PWA button (hidden on campaign pages and on the **global** instance), primary "Open app" CTA (`data-app-link`), language switcher; balkan-only Google Play promo strip with localized badge |
| `SiteFooter.astro` | Brand + tagline, legal links (privacy/cookies/terms), and "selling cars" discovery links to the instance's campaign landings when the locale copy defines them |
| `LanguageSwitcherCountry.astro` | `<details>`-based language dropdown; all 12 locales; `data-locale-pick` buttons |
| `CookieBanner.astro` | Consent banner + inline consent/analytics loader (see FEATURES.md) |
| `HomeLocaleScript.astro` / `LandingLocaleScript.astro` | Serialize the init payload and boot `initMarketingLocale` (country pages vs root picker) |
| `home/HomePage.astro` | Full homepage: hero, `TrustStrip`, problem/solution, `HowItWorks`, features grid, app showcase, security, testimonials, closing CTA |
| `home/TrustStrip.astro`, `home/HowItWorks.astro` | Homepage sub-sections |
| `auto-seller/AutoSellerLanding.astro` | Shared campaign landing for private-seller **and** dealer segments (sections toggled by content JSON); UTM hydration + GA4 landing analytics inline scripts |
| `managed-dealer/ManagedDealerLanding.astro` | Managed ("we digitize your vehicles for you") dealer landing; primary CTA is the managed inquiry URL |
| `legal/{PrivacyArticle,TosArticle,CookieArticle}.astro` | Legal article wrappers over shared renderers |
| `mcp/McpPage.astro` | MCP connector info page (hero, connection details incl. hardcoded endpoint `https://mcp.ridelogger.com/mcp`, tool groups, safety, example prompts) with its own locale hydrator |

## Build outputs

- `astro build` → static `dist/` (HTML per route + hashed JS/CSS assets + copied `public/`). No SSR, no adapter, no API routes.
- `trailingSlash: 'always'` — all internal links and canonicals end with `/`.
- `site` in `astro.config.mjs` comes from `PUBLIC_SITE_URL` at build time (fallback `https://www.servisna-knjizica.com`); it drives canonical URLs and the picker's self/peer origin logic.
- Production serving is plain Apache docroots (balkan `/var/www/ridelogger-site`, global `/var/www/ridelogger-site-global`) — see [`docs/DEPLOY_PRODUCTION.md`](./DEPLOY_PRODUCTION.md).

## E2E smoke tests

Playwright, driven by `npm run test:e2e` (runs both configs sequentially). **Recommended in Docker:** `make test-docker-e2e-site` from `~/sk` (service `sk-playwright-site` in `docker-compose.e2e.yml` — no API/MySQL; browsers preinstalled). Shared output paths live in `playwright.shared.ts` (`PLAYWRIGHT_E2E_TMP_OUTPUT=1` in Docker avoids bind-mount permission issues).

Each config **builds the site with instance-specific env** (including mailto test values for the inquiry URLs), serves it via `astro preview` on `127.0.0.1:4173`, and runs one spec:

| Config | Spec | Instance build | What it verifies |
|---|---|---|---|
| `playwright.config.ts` | `e2e/global-landings.spec.ts` | global (`PUBLIC_APP_URL=https://app.ridelogger.com`) | `/de/private-sellers/`: RideLogger title, hero CTA points to `app.ridelogger.com` with `lang=de`, no Partner link in header, language switcher present. `/de/auto-dealers/`: title + app CTA. `/de/auto-dealers/managed/`: managed CTA is the configured `mailto:`. UTM params from the landing URL hydrate into app links. Mobile-viewport smoke. `/fr/private-sellers/`: `lang=fr` in app link |
| `playwright.balkan.config.ts` | `e2e/balkan-landings.spec.ts` | balkan (`PUBLIC_APP_URL=https://app.servisna-knjizica.com`) | Mirror checks on `/sr/prodaja-auta/`, `/sr/auto-placevi/`, `/sr/auto-placevi/managed/` (`lang=sr-Latn`), UTM hydration, mobile smoke, `/mk/prodaja-auta/` (`lang=mk`, Cyrillic title) |

Notes: the homepage, picker, legal, and MCP pages are **not** covered by e2e — only campaign landings.

## Build-time environment variables (`PUBLIC_*`)

All are read at **build time** (statically inlined); none are secret. Reference values live in `.env.example`.

| Variable | Used in | Purpose / default |
|---|---|---|
| `PUBLIC_INSTANCE` | `getStaticPaths` in all `[country]` pages, `index.astro`, `404.astro`, `SiteHeader`, `SiteFooter`, `CookieBanner`, `HomeLocaleScript`, `LandingLocaleScript`, `McpPage`, `public.ts` | `balkan` \| `global`; defaults to `balkan` when unset |
| `PUBLIC_SITE_URL` | `astro.config.mjs` (`site`) | Canonical origin; drives canonicals + picker self/peer origins. Default `https://www.servisna-knjizica.com` |
| `PUBLIC_APP_URL` | `public.ts` (`getAppUrl`), `SiteLayout`, `LandingLocaleScript` | User PWA base for "Open app" CTAs. Default `https://app.servisna-knjizica.com` |
| `PUBLIC_PARTNER_APP_URL` | `public.ts` (`getPartnerAppUrl`) | Partner PWA URL override; instance-based default otherwise |
| `PUBLIC_DEALER_BONUS_INQUIRY_URL` | `public.ts` → dealer campaign pages | Dealer onboarding bonus CTA (mailto/form). Unset ⇒ CTA rendered disabled |
| `PUBLIC_MANAGED_DEALER_INQUIRY_URL` | `public.ts` → managed campaign pages | Managed dealer setup CTA; falls back to the dealer bonus URL |
| `PUBLIC_GA_MEASUREMENT_ID` | `CookieBanner.astro` | GA4 override; defaults per instance (balkan `G-E5YJE5RD06`, global `G-23VF66S9X3`) |
| `PUBLIC_GOOGLE_ADS_ID` | `CookieBanner.astro` | Google Ads tag; default only on balkan non-dev builds (`AW-18120993652`), empty on global |
| `PUBLIC_FB_PIXEL_ID` | `CookieBanner.astro` | Meta Pixel override; defaults per instance (balkan `26188160887543627`, global `1641497756898384`) |
