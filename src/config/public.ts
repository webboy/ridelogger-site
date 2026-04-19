import type { Locale } from '../i18n/config';
import { LOCALE_HREFLANG } from '../i18n/config';

/**
 * Web app entry URL (`PUBLIC_APP_URL`).
 * Query: `lang` — BCP-47 tag (see LOCALE_HREFLANG / ridelogger-pwa `normalizeLocaleParam`);
 * optional `country` — ISO 3166-1 alpha-2 (API `countries.code`), npr. RS, DE.
 */
export function getAppUrl(locale: Locale, countryCode?: string | null): string {
	const v = import.meta.env.PUBLIC_APP_URL;
	const base = typeof v === 'string' && v.length > 0 ? v : 'https://app.servisna-knjizica.com';
	const url = new URL(base);
	url.searchParams.set('lang', LOCALE_HREFLANG[locale]);
	const cc =
		typeof countryCode === 'string' && /^[a-zA-Z]{2}$/.test(countryCode)
			? countryCode.toUpperCase()
			: null;
	if (cc) url.searchParams.set('country', cc);
	return url.href;
}

/** Partner PWA (workshops / service providers). */
export function getPartnerAppUrl(): string {
	const v = import.meta.env.PUBLIC_PARTNER_APP_URL;
	if (typeof v === 'string' && v.length > 0) {
		return v.replace(/\/+$/, '');
	}
	const inst = import.meta.env.PUBLIC_INSTANCE || 'balkan';
	return inst === 'global' ? 'https://partner.ridelogger.com' : 'https://partner.servisna-knjizica.com';
}
