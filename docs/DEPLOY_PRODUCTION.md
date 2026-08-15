# Deploy (ridelogger-site) — produkcija

Javni marketing sajt (Astro, statički build). Postoje **dva** produkciona profila:

| Instanca | Domen | Podrazumevani jezik u UI | Docroot na serveru |
|----------|--------|---------------------------|---------------------|
| **balkan** | `www.servisna-knjizica.com` | sr (picker / stranice po zemlji) | `/var/www/ridelogger-site` |
| **global** | `www.ridelogger.com` | **DE** (picker, RideLogger brend) | `/var/www/ridelogger-site-global` |

`PUBLIC_SITE_URL` i `PUBLIC_APP_URL` moraju odgovarati instanci **u trenutku builda**.

**Dealer onboarding bonus** (CTA na `/…/auto-dealers/` i `/…/auto-placevi/`): podesi **`PUBLIC_DEALER_BONUS_INQUIRY_URL`** u istom build koraku (`mailto:…` ili HTTPS forma). Bez toga je dugme na tim stranicama onemogućeno. Koristi **operativni kontakt po brendu** (`online@servisna-knjizica.com` za balkan, `online@ridelogger.com` za global) — **ne** DPO / privacy adresu iz politika. Po želji drugačiji `subject` radi filtriranja (npr. `(RL)` vs `(SK)`).

**Managed dealer digitalizacija** (primarni CTA na `/…/auto-placevi/managed/` i `/…/auto-dealers/managed/`): podesi **`PUBLIC_MANAGED_DEALER_INQUIRY_URL`** (`mailto:…` ili forma). Ako nije setovan, koristi se **`PUBLIC_DEALER_BONUS_INQUIRY_URL`** kao fallback. Preporuka: odvojen `subject`, npr. `Managed digitalizacija vozila (SK)` / `Managed dealer vehicle setup (RL)`.

Host: `159.89.22.200` (SSH kao `root`, rsync + `chown www-data`).

### Šta znači „deploy“

Bez dodatnog kvalifikatora, **deploy ovog sajta na produkciju** = **oba** profila (**balkan** i **global**): poseban Astro build po instanci i poseban `rsync` na odgovarajući docroot. Izuzetak: eksplicitno *„samo balkan“* ili *„samo global“*. Isto pravilo važi i za PWA u `ridelogger-pwa` — vidi workspace pravilo `deploy-balkan-and-global.mdc` u `~/sk/.cursor/rules/`.

---

## 1. Balkan (`servisna-knjizica.com`)

| | |
|---|---|
| Docroot | `/var/www/ridelogger-site` |
| Apache | `sites-available/servisna-knjizica.com.conf` i `servisna-knjizica.com-le-ssl.conf` |

### Build (Docker)

Kontejner **`sk-site`** (port 8086):

```bash
docker exec sk-site sh -c 'cd /app && PUBLIC_INSTANCE=balkan PUBLIC_SITE_URL=https://www.servisna-knjizica.com PUBLIC_APP_URL=https://app.servisna-knjizica.com PUBLIC_DEALER_BONUS_INQUIRY_URL="mailto:online@servisna-knjizica.com?subject=Dealer%20onboarding%20bonus%20%28SK%29" PUBLIC_MANAGED_DEALER_INQUIRY_URL="mailto:online@servisna-knjizica.com?subject=Managed%20digitalizacija%20vozila%20%28SK%29" npm run build'
```

Izlaz: `ridelogger-site/dist/` na hostu (volume).

### Rsync

```bash
rsync -avz --delete \
  -e "ssh -i ~/.ssh/id_openclaw -o StrictHostKeyChecking=no" \
  /home/nemanja/sk/ridelogger-site/dist/ \
  root@159.89.22.200:/var/www/ridelogger-site/
```

```bash
ssh -i ~/.ssh/id_openclaw -o StrictHostKeyChecking=no root@159.89.22.200 \
  "chown -R www-data:www-data /var/www/ridelogger-site"
```

---

## 2. Global (`www.ridelogger.com`) — RideLogger, default DE

Statika se generiše sa `PUBLIC_INSTANCE=global`: koren `/` je country picker na nemačkom, jezici uključuju **de** (podrazumevano za ovaj sajt).

| | |
|---|---|
| Docroot | **`/var/www/ridelogger-site-global`** (direktno fajlovi iz `dist/`, **bez** podfoldera `dist` na serveru) |
| Apache (primeri u repou) | `deploy/apache-ridelogger.com.conf`, `deploy/apache-ridelogger.com-le-ssl.conf` |

### Prvo na serveru: direktorijum i vhost

```bash
ssh root@159.89.22.200 "mkdir -p /var/www/ridelogger-site-global"
```

1. Kopiraj `deploy/apache-ridelogger.com.conf` i `deploy/apache-ridelogger.com-le-ssl.conf` u `/etc/apache2/sites-available/` (na serveru često kao `ridelogger.com.conf` / `ridelogger.com-le-ssl.conf`).
2. TLS (jednom): `certbot --apache -d www.ridelogger.com -d ridelogger.com` — posle toga proveri da li su `SSLCertificateFile` / `SSLCertificateKeyFile` u `*-le-ssl.conf` ispravni (Certbot ponekad koristi drugačije ime foldera u `live/`).
3. `a2ensite …`, `apache2ctl configtest`, `systemctl reload apache2`.

### Build (Docker)

Kontejner **`sk-site-global`** (port 8087) ili isti repo u `sk-site` sa env:

```bash
docker exec sk-site-global sh -c 'cd /app && PUBLIC_INSTANCE=global PUBLIC_SITE_URL=https://www.ridelogger.com PUBLIC_APP_URL=https://app.ridelogger.com PUBLIC_DEALER_BONUS_INQUIRY_URL="mailto:online@ridelogger.com?subject=Dealer%20onboarding%20bonus%20%28RL%29" PUBLIC_MANAGED_DEALER_INQUIRY_URL="mailto:online@ridelogger.com?subject=Managed%20dealer%20vehicle%20setup%20%28RL%29" npm run build'
```

### Rsync

```bash
rsync -avz --delete \
  -e "ssh -i ~/.ssh/id_openclaw -o StrictHostKeyChecking=no" \
  /home/nemanja/sk/ridelogger-site/dist/ \
  root@159.89.22.200:/var/www/ridelogger-site-global/
```

```bash
ssh -i ~/.ssh/id_openclaw -o StrictHostKeyChecking=no root@159.89.22.200 \
  "chown -R www-data:www-data /var/www/ridelogger-site-global"
```

### Provera

```bash
curl -fsSI https://www.ridelogger.com/
curl -fsSI https://www.ridelogger.com/de/
```

Očekivano: `200`, HTML.

---

## Zajedničko

### Pre deploya (balkan vhost)

Backup vhost fajlova pre većih izmena:

```bash
cp -a /etc/apache2/sites-available/servisna-knjizica.com.conf \
  /etc/apache2/sites-available/servisna-knjizica.com.conf.bak.$(date +%Y%m%d%H%M)
```

### Apache posle izmene vhosta

```bash
apache2ctl configtest && systemctl reload apache2
```

### Napomena o legacy-ju (balkan)

Ranije je `www.servisna-knjizica.com` koristio **`/var/www/ridelogger-legacy/public`**. Astro statika je u `/var/www/ridelogger-site`.

### Apex (`servisna-knjizica.com`) — obavezno

Hostname dropleta je `servisna-knjizica`, pa Apache **`000-default`** / **`default-ssl`** (bez eksplicitnog `ServerName`) nasleđuju taj FQDN i **kradu** apex pre marketing vhosta. Posledica (viđeno 2026-07-20): apex je služio stari DigitalOcean LAMP `index.html` iz `/var/www/html` + self-signed cert — Google Safe Browsing je označio domen (sample URL sa `fbclid` na apexu).

**Trajno stanje:**

- `000-default` i `default-ssl` **disabled** (`a2dissite`).
- HTTP (`servisna-knjizica.com.conf`): `ServerName` + `ServerAlias www` → **301** na `https://www.servisna-knjizica.com%{REQUEST_URI}`.
- HTTPS (`servisna-knjizica.com-le-ssl.conf`): `ServerName www`, `ServerAlias` apex, `DocumentRoot /var/www/ridelogger-site`, apex → **301** na www; LE cert `live/servisna-knjizica.com` (SAN: apex + www).
- DO placeholder: `/var/www/html/index.html` uklonjen/backupovan (ne vraćati).

Provera:

```bash
curl -sSI http://servisna-knjizica.com/ | head -5
# očekivano: 301 → https://www.servisna-knjizica.com/
curl -sSI https://servisna-knjizica.com/ | head -5
# očekivano: 301 → https://www.servisna-knjizica.com/
curl -fsS https://www.servisna-knjizica.com/ | head -c 200
# očekivano: Astro HTML (Digitalna servisna knjižica), NE DigitalOcean LAMP
```

Posle fixa: u Search Console → Security Issues → **Request a review** (tek kad provere gore prolaze).

### Crawl artifacts (posle deploya)

Proveri da Apache servira statičke fajlove iz docroot-a (404 na produkciji obično znači da build nije rsync-ovan ili vhost ne pokazuje na pravi folder):

```bash
# Balkan
curl -sSI https://www.servisna-knjizica.com/robots.txt | head -3
curl -sSI https://www.servisna-knjizica.com/sitemap.xml | head -3
curl -sSI https://www.servisna-knjizica.com/llms.txt | head -3

# Global
curl -sSI https://www.ridelogger.com/robots.txt | head -3
curl -sSI https://www.ridelogger.com/sitemap.xml | head -3
curl -sSI https://www.ridelogger.com/llms.txt | head -3
```

Očekivano: **HTTP 200**; `robots.txt` sadrži `Sitemap:` sa odgovarajućim origin-om; global sitemap `<loc>` URL-ovi su samo pod `www.ridelogger.com`, balkan samo pod `www.servisna-knjizica.com` (peer hreflang URL-ovi mogu biti u `xhtml:link` unutar sitemap-a).

**WAF / bot blocking:** proveri da Cloudflare ili server firewall ne seče `OAI-SearchBot`, `PerplexityBot`, ili `Googlebot` na marketing domenima. Ako se botovi blokiraju, hreflang/sitemap ne pomažu — prvo dozvoliti crawl.

### Apache — održavanje servera

- U **`sites-enabled`** ne ostavljati `*.bak` fajlove (Apache ih čita kao konfiguraciju).
- **Ne** ponovo `a2ensite 000-default` / `default-ssl` dok je hostname dropleta vezan za marketing domen.
- Globalno **`ServerName`** u `/etc/apache2/apache2.conf` uklanja upozorenje o FQDN (poželjno nešto što nije javni marketing host).
