import type { Locale } from '../i18n/config';
import { LOCALE_HREFLANG } from '../i18n/config';

/** Web app entry URL (PWA); override with PUBLIC_APP_URL in `.env`. `lang` matches ridelogger-pwa `SUPPORTED_LOCALES`. */
export function getAppUrl(locale: Locale): string {
	const v = import.meta.env.PUBLIC_APP_URL;
	const base = typeof v === 'string' && v.length > 0 ? v : 'https://app.servisna-knjizica.com';
	const url = new URL(base);
	url.searchParams.set('lang', LOCALE_HREFLANG[locale]);
	return url.href;
}
