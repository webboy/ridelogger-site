# Features — ridelogger-site

**Last verified:** 2026-07-04

> Ecosystem-level documentation: `~/sk/memory/docs/`.
> Deployment: [`docs/DEPLOY_PRODUCTION.md`](./DEPLOY_PRODUCTION.md) (authoritative). Technical architecture: [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md).

## Feature overview

| # | Feature | Route pattern | Instances |
|---|---|---|---|
| 1 | Country picker | `/` | both |
| 2 | Localized country homepages | `/{country}/` | both |
| 3 | Legal pages | `/{country}/privacy/`, `/terms/`, `/cookies/` | both |
| 4 | MCP info page | `/{country}/mcp/` | both |
| 5 | Campaign landings — global (RL) | `/{country}/private-sellers/`, `/auto-dealers/`, `/auto-dealers/managed/` | global |
| 6 | Campaign landings — balkan (SK) | `/{country}/prodaja-auta/`, `/auto-placevi/`, `/auto-placevi/managed/` | balkan |
| 7 | Cookie consent banner | all pages | both |
| 8 | Dealer inquiry CTAs (mailto/form) | dealer + managed landings | both |
| 9 | CTA wiring to User PWA / Partner PWA | header, home, campaigns, MCP | both |

---

## 1. Country picker

- **Route:** `/` — **Source:** `src/pages/index.astro`, `src/components/LanguageSwitcherCountry.astro`, `src/components/LandingLocaleScript.astro`, `src/config/countries.ts`

Instance-aware landing page. Two country groups rendered over a Europe-map panel: "RideLogger.com" (de, fr, it, ch, at, si, us) and "servisna-knjizica.com" (sr, hr, ba, me, mk). Countries belonging to the *current* build link within the same origin; countries of the *other* instance link cross-domain via `peerMarketingOrigin()` (SK ⇄ RL cross-linking), so both domains expose the full country list. Branding, tagline language (sr-Latn vs German), country label language, and legal-link country (`/sr/` vs `/de/`) follow `PUBLIC_INSTANCE`. Last picked country is remembered in `localStorage` (`sk_marketing_last_country`) and highlighted. Footer includes the 12-locale language switcher (client-side copy switch via `LandingLocaleScript`) and cookie banner.

## 2. Localized country homepages

- **Route:** `/{country}/` — **Source:** `src/pages/[country]/index.astro`, `src/components/home/HomePage.astro` (+ `TrustStrip.astro`, `HowItWorks.astro`), `src/layouts/SiteLayout.astro`, `src/i18n/messages/home/*.json`

One statically generated homepage per country of the current instance, rendered in the country's `defaultLocale` (`src/config/countries.ts`). Sections: hero with app CTA, trust strip, problem/solution, how-it-works, features grid, app screenshot showcase, security, testimonials, closing CTA. Visitors can switch among all 12 locales client-side (`HomeLocaleScript` → `src/scripts/marketingLocale.ts`); the choice persists per country + instance in `localStorage` and can be preset via `?lang=`. The visible brand name follows the selected *language* (`brandName()`): Balkan languages show "Servisna Knjižica", others show "RideLogger". Footer shows discovery links to the instance's campaign landings when the locale copy defines `footer.sellingCarsTitle` etc. (`SiteFooter.astro`).

## 3. Legal pages (privacy / terms / cookies)

- **Routes:** `/{country}/privacy/`, `/{country}/terms/`, `/{country}/cookies/` — **Source:** `src/pages/[country]/{privacy,terms,cookies}.astro`, `src/components/legal/*.astro`, `src/utils/render{Privacy,Tos,Cookie}ArticleHtml.ts`, `src/utils/legalReplace.ts`, `src/data/legal/*.json`

Per-locale legal content stored as JSON bundles (`privacy_v2`, `tos`, `cookie_policy` keys) and rendered to HTML by shared renderer functions used both at build time and by the client-side language switcher (switching language swaps the entire article plus title/meta without navigation). `:privacy_url` placeholders in ToS/cookie copy (a legacy Laravel convention) are replaced with the country's canonical privacy URL. Every country of the instance gets all three pages.

## 4. MCP info page

- **Route:** `/{country}/mcp/` — **Source:** `src/pages/[country]/mcp.astro`, `src/components/mcp/McpPage.astro`, `src/i18n/mcpPage.ts`

Marketing/documentation page for the Claude MCP connector. Content: hero with "Open app" CTA (User PWA URL with `?lang`/`?country`) and privacy-policy link, a connection-details card (endpoint hardcoded to `https://mcp.ridelogger.com/mcp`, transport "Streamable HTTP", auth "OAuth 2.0 / Bearer token"), five tool-group cards (vehicles/plates, logs, files/cabinet, reminders, account/reference/policy), privacy & safety bullets, and example prompts. Copy is fully translated for en/de/sr-latn/hr/mk/fr/it/sl; `sr-cyrl` falls back to sr-Latn and `tr`/`uk`/`pl` fall back to English. Built for **both** instances; branding in copy follows locale (RideLogger vs Servisna Knjižica). Uses its own lightweight locale hydrator (`data-mcp-key`), sharing the `marketing_ui_locale_*` storage key with the rest of the site.

## 5. Campaign landing pages — global (RideLogger)

Built only when `PUBLIC_INSTANCE=global`; one page per global country (de, fr, it, ch, at, si, us). Copy locale = `campaignLocaleForCountry()`: the country's `defaultLocale`, except `us` which uses `campaignLocale: 'de'` (there is no English campaign copy — US campaign pages render in German). Copy JSON: `src/i18n/messages/autoSeller/rl-{de,fr,it,sl}-{private,dealers,managed-dealers}.json` via `src/i18n/autoSellerCampaigns.ts` / `managedDealerCampaigns.ts`. All use the campaign header variant (Partner link hidden, language switcher kept) and `lockMarketingSeo` (title/description stay as SSR'd even after language switch).

| Page | Route | Source page | Purpose | CTA targets (from code) |
|---|---|---|---|---|
| Private sellers | `/{country}/private-sellers/` | `src/pages/[country]/private-sellers.astro` → `AutoSellerLanding.astro` | Convince private car sellers to document vehicle history before selling | Primary hero + closing CTAs → User PWA (`getAppUrl(locale, country)`); secondary hero CTA → in-page `#how`; no dealer inquiry (`dealerInquiryUrl={null}`) |
| Auto dealers (DIY) | `/{country}/auto-dealers/` | `src/pages/[country]/auto-dealers.astro` → `AutoSellerLanding.astro` | Dealer-focused pitch (inventory credibility, before/after, onboarding bonus offer) | Hero/closing CTAs → User PWA; secondary hero CTA → `#dealer-offer`; offer section CTA → `PUBLIC_DEALER_BONUS_INQUIRY_URL` (disabled placeholder if unset); `relatedOffer` card cross-links to `managed/` |
| Auto dealers (managed) | `/{country}/auto-dealers/managed/` | `src/pages/[country]/auto-dealers/managed.astro` → `ManagedDealerLanding.astro` | "We digitize your vehicles for you" managed onboarding service, with pricing and privacy sections | Primary hero CTA → `PUBLIC_MANAGED_DEALER_INQUIRY_URL` (fallback: dealer bonus URL; disabled if neither set); secondary hero CTA and closing "DIY" CTA → `../` (back to the DIY dealer landing) |

## 6. Campaign landing pages — balkan (Servisna Knjižica)

Built only when `PUBLIC_INSTANCE=balkan`; one page per balkan country (sr, hr, ba, me, mk), copy in the country's `defaultLocale` (sr-latn/hr/mk). Copy JSON: `src/i18n/messages/autoSeller/sk-{sr,hr,mk}-{private,dealers,managed-dealers}.json`. Structure and CTA wiring are identical to the global set — same shared components, different slugs and brand:

| Page | Route | Source page | Global equivalent |
|---|---|---|---|
| Private sellers | `/{country}/prodaja-auta/` | `src/pages/[country]/prodaja-auta.astro` | `private-sellers` |
| Auto dealers (DIY) | `/{country}/auto-placevi/` | `src/pages/[country]/auto-placevi.astro` | `auto-dealers` |
| Auto dealers (managed) | `/{country}/auto-placevi/managed/` | `src/pages/[country]/auto-placevi/managed.astro` | `auto-dealers/managed` |

### Campaign landing shared behavior (`AutoSellerLanding.astro`, `ManagedDealerLanding.astro`)

- **UTM passthrough:** an inline script copies `utm_*`, `gclid`, `fbclid` from the landing URL onto every `a[data-app-link]`, so ad-click attribution reaches the User PWA (covered by e2e).
- **Analytics:** GA4 events `landing_page_view` and `landing_cta_click` with `brand` (`rl`/`sk`), `segment` (`private`/`dealer`), `cta_id` (`hero_primary`, `hero_secondary[_scroll]`, `related_managed_offer`, `dealer_inquiry`, `offer_app`, `closing_primary`, `managed_inquiry_primary`, `managed_diy_secondary`), and `page_path`. A `dealer_inquiry` click also fires Meta Pixel `Contact`.
- **Content-driven sections:** optional blocks (`beforeAfter`, `inventoryAngle`, `objection`, `offer`, `relatedOffer`) render only when present in the copy JSON — this is how one component serves both the private and dealer segments.

## 7. Cookie consent banner

- **Source:** `src/components/CookieBanner.astro` (included by `SiteLayout`, the root picker, and `404.astro`); strings from `src/data/legal/<locale>.json` → `cookie_banner`

Consent state is stored in `localStorage` under `sk_cookie_consent_v1` (`all` | `essential`). Behavior:

- The Google tag (gtag.js) is **always loaded** with Google Consent Mode v2 defaults set to `denied` (all four signals) and `wait_for_update: 500`; "Accept" flips consent to `granted`, "Reject" keeps `denied`.
- Meta Pixel is loaded **only** after full consent (`all`).
- IDs are instance-defaulted with env overrides: GA4 `PUBLIC_GA_MEASUREMENT_ID` (balkan `G-E5YJE5RD06`, global `G-23VF66S9X3`), Google Ads `PUBLIC_GOOGLE_ADS_ID` (balkan-only default `AW-18120993652`, empty on global and in dev), Meta Pixel `PUBLIC_FB_PIXEL_ID` (balkan `26188160887543627`, global `1641497756898384`).
- Banner links to the country's `/cookies/` page; returning visitors with a stored choice never see the banner.

## 8. Dealer inquiry (mailto config)

- **Source:** `src/config/public.ts` (`getDealerBonusInquiryUrl`, `getManagedDealerInquiryUrl`), consumed by `auto-dealers.astro` / `auto-placevi.astro` (offer section) and both `managed.astro` pages (primary CTA)

Both inquiry CTAs are plain links whose targets come from build-time env (`mailto:` or an https form URL — production uses brand ops mailboxes per `docs/DEPLOY_PRODUCTION.md` and `.env.example`). If `PUBLIC_DEALER_BONUS_INQUIRY_URL` is unset, the dealer-offer button renders as a disabled, non-clickable element (with a hint in its `title`). The managed inquiry URL falls back to the dealer bonus URL; only if both are missing is the managed CTA disabled. E2E builds inject `mailto:e2e-…@example.com` values and assert the hrefs.

## 9. CTA wiring to User PWA and Partner PWA

- **Source:** `src/config/public.ts`, `src/components/SiteHeader.astro`, `src/components/home/HomePage.astro`, campaign/MCP components, `src/scripts/marketingLocale.ts`

**User PWA** ("Open app", hero/closing CTAs, MCP hero): `getAppUrl(locale, countryCode)` builds `PUBLIC_APP_URL` + `?lang=<BCP-47>` (from `LOCALE_HREFLANG`, e.g. `sr-Latn`, `de`) + `&country=<ISO 3166-1 alpha-2>` (uppercased `flagCode` of the country page, matching API `countries.code`). All such links carry `data-app-link`, so when the visitor switches language client-side, every app link is rewritten with the new `lang` while keeping the country. On campaign pages the links additionally receive `utm_*`/`gclid`/`fbclid` passthrough.

**Partner PWA:** a ghost button in the header (`getPartnerAppUrl()` → `PUBLIC_PARTNER_APP_URL` or instance default `partner.servisna-knjizica.com` / `partner.ridelogger.com`). It is shown only on the **balkan** instance and never on campaign pages (`showPartnerLink = !isCampaign && instance !== 'global'` in `SiteHeader.astro`) — the global header has no Partner link at all. No `lang`/`country` params are appended to the Partner URL.

**Google Play (balkan only):** a header promo strip links to the SK Android listing (`src/utils/googlePlayBadge.ts`, `id=app.servisnaknjizica`) with a locale-matched badge image from `public/badges/google-play/`; the badge swaps with the client-side language switch.
