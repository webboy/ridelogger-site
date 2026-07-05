# ridelogger-site

Public marketing site (Astro, static): country-based routes, homepage picker, privacy and cookie pages.

## Commands

### Local (Node on host)

```bash
npm install
npm run dev
npm run build
npm run preview
```

### Docker (unified stack under `~/sk`)

| Service | Port | Instance |
|---------|------|----------|
| **`sk-site`** | 8086 | `PUBLIC_INSTANCE=balkan` → Servisna knjižica |
| **`sk-site-global`** | 8087 | `PUBLIC_INSTANCE=global` → RideLogger (default **DE** in UI) |

```bash
cd ~/sk
docker compose -f docker/docker-compose.yml --project-directory ~/sk up -d sk-site sk-site-global
# http://localhost:8086 — balkan
# http://localhost:8087 — global (ridelogger.com profile)
```

Run commands inside the container:

```bash
docker exec sk-site npm run build
```

Compose sets `PUBLIC_APP_URL` for local PWA (`sk-app`). Override in `docker-compose.yml` if needed.

## Configuration

- **`astro.config.mjs`**: `site` base URL from `PUBLIC_SITE_URL` at build time.
- **`.env`**: copy `.env.example`. Use **balkan** or **global** env block; `PUBLIC_APP_URL` drives “Open app” CTAs.

## Production deploy

Two production targets — see **`docs/DEPLOY_PRODUCTION.md`**:

- **Balkan**: docroot `/var/www/ridelogger-site`
- **Global** (`www.ridelogger.com`): docroot `/var/www/ridelogger-site-global`, Apache samples in **`deploy/apache-ridelogger.com.conf`** and **`deploy/apache-ridelogger.com-le-ssl.conf`**

## Locales / routes

Routes are under `/[country]/` (e.g. `/de/`, `/sr/`). Root `/` is the country picker; branding and default copy depend on **`PUBLIC_INSTANCE`** (`balkan` vs `global`).

### Campaign landings (auto sellers)

Built only for the matching instance:

| Path pattern | Instance | Default copy |
|--------------|----------|----------------|
| `/{country}/private-sellers/` | `global` | Per country default locale: `de` (de, ch, at), `fr`, `it`, `sl` (si) |
| `/{country}/auto-dealers/` | `global` | Same locales as above |
| `/{country}/auto-dealers/managed/` | `global` | Managed dealer vehicle setup (same locales) |
| `/{country}/prodaja-auta/` | `balkan` | Per country: `sr-latn` (sr, ba, me), `hr`, `mk` |
| `/{country}/auto-placevi/` | `balkan` | Same locales as above |
| `/{country}/auto-placevi/managed/` | `balkan` | Managed dealer vehicle setup (same locales) |

`{country}` is every path in `countryPagesForInstance` for that build (`de`, `fr`, `it`, `ch`, `at`, `si` vs `sr`, `hr`, `ba`, `me`, `mk`).

These pages use a campaign header (no Partner PWA CTA; language switcher matches the main site). Primary CTAs open the main PWA (`PUBLIC_APP_URL`). Set **`PUBLIC_DEALER_BONUS_INQUIRY_URL`** at build time for production so the dealer bonus button works on dealer pages; set **`PUBLIC_MANAGED_DEALER_INQUIRY_URL`** for managed dealer landing CTAs (falls back to dealer bonus URL if unset — see `docs/DEPLOY_PRODUCTION.md`).

**Discovery from the homepage:** country footers include links to the matching campaign URLs for that country path.

### E2E

Requires **Node >= 22.12** (see `engines`). **Recommended:** isolated Playwright container (same pattern as User PWA / Partner PWA):

```bash
# from ~/sk
make test-docker-e2e-site
# debug — leave container up:
SKIP_E2E_DOWN=1 make test-docker-e2e-site
```

Direct script: `bash ~/sk/docker/scripts/run-site-e2e.sh`

Uses `docker-compose.e2e.yml` service **`sk-playwright-site`** (`mcr.microsoft.com/playwright:v1.52.0-jammy`). Astro build + preview run inside Playwright's `webServer`; no API/MySQL dependency. HTML report copied to `playwright-report-docker/` on success.

**Host-only** (needs local Node 22.12+ and `npx playwright install`):

```bash
npm run test:e2e
```

Builds `global` and `balkan` in sequence, serves with `astro preview`, and runs Playwright smoke tests (including sample locales per instance).

## Media workflow

Generated or reference images belong under `media/` (gitignored except `README` / `.gitkeep`). Integrate approved assets from `media/generated/` into components as needed.
