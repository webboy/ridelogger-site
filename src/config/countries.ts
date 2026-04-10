import type { Locale } from '../i18n/config';

export type DeployInstance = 'balkan' | 'global';

export type CountryPageConfig = {
	/** URL segment, e.g. sr, de */
	path: string;
	/** flag-icons / public flags: lowercase ISO */
	flagCode: string;
	instance: DeployInstance;
	defaultLocale: Locale;
	names: {
		'sr-latn': string;
		hr: string;
		en: string;
		de: string;
	};
};

export const COUNTRY_PAGES: CountryPageConfig[] = [
	{
		path: 'sr',
		flagCode: 'rs',
		instance: 'balkan',
		defaultLocale: 'sr-latn',
		names: { 'sr-latn': 'Srbija', hr: 'Srbija', en: 'Serbia', de: 'Serbien' },
	},
	{
		path: 'hr',
		flagCode: 'hr',
		instance: 'balkan',
		defaultLocale: 'hr',
		names: { 'sr-latn': 'Hrvatska', hr: 'Hrvatska', en: 'Croatia', de: 'Kroatien' },
	},
	{
		path: 'ba',
		flagCode: 'ba',
		instance: 'balkan',
		defaultLocale: 'sr-latn',
		names: { 'sr-latn': 'BiH', hr: 'BiH', en: 'Bosnia and Herzegovina', de: 'Bosnien und Herzegowina' },
	},
	{
		path: 'me',
		flagCode: 'me',
		instance: 'balkan',
		defaultLocale: 'sr-latn',
		names: { 'sr-latn': 'Crna Gora', hr: 'Crna Gora', en: 'Montenegro', de: 'Montenegro' },
	},
	{
		path: 'mk',
		flagCode: 'mk',
		instance: 'balkan',
		defaultLocale: 'sr-latn',
		names: { 'sr-latn': 'S. Makedonija', hr: 'Sjeverna Makedonija', en: 'North Macedonia', de: 'Nordmazedonien' },
	},
	{
		path: 'de',
		flagCode: 'de',
		instance: 'global',
		defaultLocale: 'de',
		names: { 'sr-latn': 'Nemačka', hr: 'Njemačka', en: 'Germany', de: 'Deutschland' },
	},
];

export function countryPagesForInstance(instance: DeployInstance): CountryPageConfig[] {
	return COUNTRY_PAGES.filter((c) => c.instance === instance);
}

export function getCountryByPath(path: string): CountryPageConfig | undefined {
	return COUNTRY_PAGES.find((c) => c.path === path);
}

/** ISO 3166-1 alpha-2 for PWA `?country=` (matches API `countries.code`). */
export function appCountryCodeFromPath(path: string): string | null {
	const c = getCountryByPath(path);
	if (!c || typeof c.flagCode !== 'string' || c.flagCode.length !== 2) return null;
	return c.flagCode.toUpperCase();
}

/** Absolute marketing origin for the other instance (cross-domain country links). */
export function peerMarketingOrigin(selfOrigin: string): string {
	try {
		const host = new URL(selfOrigin).hostname.replace(/^www\./, '');
		if (host.includes('servisna-knjizica')) {
			return 'https://www.ridelogger.com';
		}
		return 'https://www.servisna-knjizica.com';
	} catch {
		return 'https://www.ridelogger.com';
	}
}
