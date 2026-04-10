# Apache primeri (produkcija)

| Fajl u repou | Tipična putanja na serveru |
|--------------|----------------------------|
| `apache-ridelogger.com.conf` | `/etc/apache2/sites-available/ridelogger.com.conf` |
| `apache-ridelogger.com-le-ssl.conf` | `/etc/apache2/sites-available/ridelogger.com-le-ssl.conf` |

**DocumentRoot** za `www.ridelogger.com`: `/var/www/ridelogger-site-global` (global Astro build, default DE).

Posle izmene: `apache2ctl configtest && systemctl reload apache2`.
