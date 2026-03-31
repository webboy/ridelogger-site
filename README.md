# ridelogger-site

Public marketing site (Astro, static): multilingual homepage, privacy and cookie policy pages.

## Commands

### Local (Node on host)

```bash
npm install
npm run dev
npm run build
npm run preview
```

### Docker (unified stack under `~/sk`)

Service **`sk-site`** on port **8086** is defined in `~/sk/docker/docker-compose.yml`:

```bash
cd ~/sk
docker compose -f docker/docker-compose.yml --project-directory ~/sk up -d sk-site
# http://localhost:8086  (dev server with HMR)
```

Run commands inside the container:

```bash
docker exec sk-site npm run build
```

Compose sets `PUBLIC_APP_URL=http://localhost:8081` (PWA `sk-app`). Override in `docker-compose.yml` if needed.

## Configuration

- **`astro.config.mjs`**: `site` base URL for canonical and `hreflang` links (default: `https://www.servisna-knjizica.com`).
- **`.env`**: copy `.env.example`. `PUBLIC_APP_URL` is used for primary “Open app” CTAs.

## Production deploy

See **`docs/DEPLOY_PRODUCTION.md`** (build, rsync, Apache docroot on `159.89.22.200`).

## Locales

Routes: `/sr-latn/`, `/sr-cyrl/`, `/hr/`, `/de/`, `/en/` (trailing slash). Root `/` redirects to `/sr-latn/`.

Marketing brand name: **Servisna Knjižica** (Balkan locales) vs **RideLogger** (English/German), via `src/i18n/config.ts`. Legal copy is imported from legacy translations in `src/data/legal/*.json`.

## Media workflow

Generated or reference images belong under `media/` (gitignored except `README` / `.gitkeep`). Integrate approved assets from `media/generated/` into components as needed.
