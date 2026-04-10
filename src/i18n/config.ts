export const LOCALES = ['sr-latn', 'sr-cyrl', 'hr', 'de', 'en', 'mk', 'fr', 'it', 'sl'] as const;

export type Locale = (typeof LOCALES)[number];

/** Default entry locale for `/` redirect (deterministic, SEO-safe). */
export const DEFAULT_LOCALE: Locale = 'sr-latn';

export const LOCALE_LABELS: Record<Locale, string> = {
	'sr-latn': 'Srpski (latinica)',
	'sr-cyrl': 'Српски (ћирилица)',
	hr: 'Hrvatski',
	de: 'Deutsch',
	en: 'English',
	mk: 'Македонски',
	fr: 'Français',
	it: 'Italiano',
	sl: 'Slovenščina',
};

/** Kratke oznake za uski ekran (header / language picker). */
export const LOCALE_SHORT: Record<Locale, string> = {
	'sr-latn': 'SR',
	'sr-cyrl': 'СР',
	hr: 'HR',
	de: 'DE',
	en: 'EN',
	mk: 'МК',
	fr: 'FR',
	it: 'IT',
	sl: 'SL',
};

/** Ime fajla u `public/flags/*.svg` (isti skup kao u ridelogger-pwa). */
export const LOCALE_FLAG: Record<Locale, string> = {
	'sr-latn': 'rs',
	'sr-cyrl': 'rs',
	hr: 'hr',
	de: 'de',
	en: 'gb',
	mk: 'mk',
	fr: 'fr',
	it: 'it',
	sl: 'si',
};

/** BCP 47 tags for hreflang. */
export const LOCALE_HREFLANG: Record<Locale, string> = {
	'sr-latn': 'sr-Latn',
	'sr-cyrl': 'sr-Cyrl',
	hr: 'hr',
	de: 'de',
	en: 'en',
	mk: 'mk',
	fr: 'fr',
	it: 'it',
	sl: 'sl',
};

export function isBalkanLocale(locale: Locale): boolean {
	return locale === 'sr-latn' || locale === 'sr-cyrl' || locale === 'hr' || locale === 'mk';
}

/** Visible product name by locale (marketing UI). Legal pages keep legacy wording. */
export function brandName(locale: Locale): string {
	return isBalkanLocale(locale) ? 'Servisna Knjižica' : 'RideLogger';
}

export function isLocale(value: string): value is Locale {
	return (LOCALES as readonly string[]).includes(value);
}
