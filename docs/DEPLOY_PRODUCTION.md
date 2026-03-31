# Deploy (ridelogger-site) — produkcija

Javni marketing sajt (Astro, statički build). Namena domena u kodu: **`https://www.servisna-knjizica.com`** (`astro.config.mjs`). Aplikacija (PWA): **`PUBLIC_APP_URL`** (npr. `https://app.servisna-knjizica.com`) mora biti postavljen **u trenutku builda**.

## Server

| | |
|---|---|
| Host | `159.89.22.200` |
| Docroot | `/var/www/ridelogger-site` |
| Apache | `sites-available/servisna-knjizica.com.conf` (HTTP) i `servisna-knjizica.com-le-ssl.conf` (HTTPS): `DocumentRoot` i `<Directory>` za `www` / SSL vhost usmereni na `/var/www/ridelogger-site` |

TLS: postojeći Let’s Encrypt set (`/etc/letsencrypt/live/servisna-knjizica.com/`) — bez promene osim obnove sertifikata.

## Pre deploya

1. Backup Apache vhost fajlova pre prve migracije sa legacy `DocumentRoot`-a:
   ```bash
   cp -a /etc/apache2/sites-available/servisna-knjizica.com.conf \
     /etc/apache2/sites-available/servisna-knjizica.com.conf.bak.$(date +%Y%m%d%H%M)
   cp -a /etc/apache2/sites-available/servisna-knjizica.com-le-ssl.conf \
     /etc/apache2/sites-available/servisna-knjizica.com-le-ssl.conf.bak.$(date +%Y%m%d%H%M)
   ```

2. **`DirectoryIndex`**: za statički sajt dovoljno je `index.html` (bez PHP prioriteta).

## Build (Docker)

Iz `~/sk` sa pokrenutim kontejnerom **`sk-site`**:

```bash
docker exec -e PUBLIC_APP_URL=https://app.servisna-knjizica.com sk-site sh -c 'cd /app && npm run build'
```

Izlaz: `ridelogger-site/dist/` (na hostu, volume `./ridelogger-site`).

## Rsync na server

Sa radne mašine (prilagodi putanju do repoa):

```bash
rsync -avz --delete \
  -e "ssh -i ~/.ssh/id_openclaw -o StrictHostKeyChecking=no" \
  /home/nemanja/sk/ridelogger-site/dist/ \
  root@159.89.22.200:/var/www/ridelogger-site/
```

Zatim na serveru vlasništvo za čitanje od strane Apacheja:

```bash
ssh root@159.89.22.200 "chown -R www-data:www-data /var/www/ridelogger-site"
```

## Apache posle promene vhosta

```bash
apache2ctl configtest && systemctl reload apache2
```

## Provera

```bash
curl -fsSI https://www.servisna-knjizica.com/sr-latn/
```

Očekivano: `200`, HTML. Koren `/` servira Astro `index.html` (redirekcija ka podrazumevanom jeziku).

## Napomena o legacy-ju

Ranije je `www.servisna-knjizica.com` koristio **`/var/www/ridelogger-legacy/public`**. Posle prebacivanja na Astro, **admin** ostaje na `admin.servisna-knjizica.com`, **API** na `api.*`, **PWA** na `app.*`; javni landing je isključivo statički sadržaj u `/var/www/ridelogger-site`.

## Apache — održavanje servera

- U **`sites-enabled`** ne ostavljati `*.bak` fajlove (Apache ih čita kao konfiguraciju). Backuppove držati u `sites-available` ili van `sites-*`.
- **Biznis** poddomeni (`biznis.*`, `biznis-api.*`): ako docroot na disku ne postoji, `apache2ctl configtest` prijavljuje upozorenja; odgovarajuće vhostove isključiti (`a2dissite …`) dok se ponovo ne deployuje aplikacija.
- Globalno **`ServerName`** u `/etc/apache2/apache2.conf` uklanja upozorenje `Could not reliably determine the server's fully qualified domain name`.
