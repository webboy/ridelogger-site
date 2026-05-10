import type { Locale } from '../i18n/config';

/** Balkan-only: koristi se samo kad je `PUBLIC_INSTANCE=balkan` (SiteFooter). Ne koristiti na global deployu. */

/** Servisna Knjižica / balkan Android listing */
export const GOOGLE_PLAY_APP_HREF =
	'https://play.google.com/store/apps/details?id=app.servisnaknjizica';

/** Badge raster stem under `/badges/google-play/` (official artwork from Google Play badge CDN). */
const LOCALE_BADGE_STEM: Record<Locale, string> = {
	'sr-latn': 'sr',
	'sr-cyrl': 'sr',
	hr: 'hr',
	mk: 'mk',
	de: 'de',
	en: 'en',
	fr: 'fr',
	it: 'it',
	sl: 'sl',
	tr: 'tr',
	uk: 'ua',
	pl: 'pl',
};

export function googlePlayBadgeImageSrc(locale: Locale): string {
	const stem = LOCALE_BADGE_STEM[locale];
	return `/badges/google-play/${stem}.png`;
}

/** Optional vector badge (same basename). Browser uses PNG if SVG is missing. */
export function googlePlayBadgeVectorSrc(locale: Locale): string {
	const stem = LOCALE_BADGE_STEM[locale];
	return `/badges/google-play/${stem}.svg`;
}
