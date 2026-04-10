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
- **Global** (`www.ridelogger.com`): docroot `/var/www/ridelogger-site-global`, Apache samples in **`deploy/apache-www.ridelogger.com*.conf`**

## Locales / routes

Routes are under `/[country]/` (e.g. `/de/`, `/sr/`). Root `/` is the country picker; branding and default copy depend on **`PUBLIC_INSTANCE`** (`balkan` vs `global`).

## Media workflow

Generated or reference images belong under `media/` (gitignored except `README` / `.gitkeep`). Integrate approved assets from `media/generated/` into components as needed.
