# Deploy (ridelogger-site) — produkcija

Javni marketing sajt (Astro, statički build). Postoje **dva** produkciona profila:

| Instanca | Domen | Podrazumevani jezik u UI | Docroot na serveru |
|----------|--------|---------------------------|---------------------|
| **balkan** | `www.servisna-knjizica.com` | sr (picker / stranice po zemlji) | `/var/www/ridelogger-site` |
| **global** | `www.ridelogger.com` | **DE** (picker, RideLogger brend) | `/var/www/ridelogger-site-global` |

`PUBLIC_SITE_URL` i `PUBLIC_APP_URL` moraju odgovarati instanci **u trenutku builda**.

**Dealer onboarding bonus** (CTA na `/…/auto-dealers/` i `/…/auto-placevi/`): podesi **`PUBLIC_DEALER_BONUS_INQUIRY_URL`** u istom build koraku (`mailto:…` ili HTTPS forma). Bez toga je dugme na tim stranicama onemogućeno. Koristi **operativni kontakt po brendu** (`online@servisna-knjizica.com` za balkan, `online@ridelogger.com` za global) — **ne** DPO / privacy adresu iz politika. Po želji drugačiji `subject` radi filtriranja (npr. `(RL)` vs `(SK)`).

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
docker exec sk-site sh -c 'cd /app && PUBLIC_INSTANCE=balkan PUBLIC_SITE_URL=https://www.servisna-knjizica.com PUBLIC_APP_URL=https://app.servisna-knjizica.com PUBLIC_DEALER_BONUS_INQUIRY_URL="mailto:online@servisna-knjizica.com?subject=Dealer%20onboarding%20bonus%20%28SK%29" npm run build'
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
docker exec sk-site-global sh -c 'cd /app && PUBLIC_INSTANCE=global PUBLIC_SITE_URL=https://www.ridelogger.com PUBLIC_APP_URL=https://app.ridelogger.com PUBLIC_DEALER_BONUS_INQUIRY_URL="mailto:online@ridelogger.com?subject=Dealer%20onboarding%20bonus%20%28RL%29" npm run build'
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

### Apache — održavanje servera

- U **`sites-enabled`** ne ostavljati `*.bak` fajlove (Apache ih čita kao konfiguraciju).
- Globalno **`ServerName`** u `/etc/apache2/apache2.conf` uklanja upozorenje o FQDN.
