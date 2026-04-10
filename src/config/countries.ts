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
		mk: string;
		en: string;
		de: string;
		fr: string;
		it: string;
		sl: string;
		tr: string;
		uk: string;
		pl: string;
	};
};

export const COUNTRY_PAGES: CountryPageConfig[] = [
	{
		path: 'sr',
		flagCode: 'rs',
		instance: 'balkan',
		defaultLocale: 'sr-latn',
		names: {
			'sr-latn': 'Srbija',
			hr: 'Srbija',
			mk: 'Србија',
			en: 'Serbia',
			de: 'Serbien',
			fr: 'Serbie',
			it: 'Serbia',
			sl: 'Srbija',
			tr: 'Sırbistan',
			uk: 'Сербія',
			pl: 'Serbia',
		},
	},
	{
		path: 'hr',
		flagCode: 'hr',
		instance: 'balkan',
		defaultLocale: 'hr',
		names: {
			'sr-latn': 'Hrvatska',
			hr: 'Hrvatska',
			mk: 'Хрватска',
			en: 'Croatia',
			de: 'Kroatien',
			fr: 'Croatie',
			it: 'Croazia',
			sl: 'Hrvaška',
			tr: 'Hırvatistan',
			uk: 'Хорватія',
			pl: 'Chorwacja',
		},
	},
	{
		path: 'ba',
		flagCode: 'ba',
		instance: 'balkan',
		defaultLocale: 'sr-latn',
		names: {
			'sr-latn': 'BiH',
			hr: 'BiH',
			mk: 'Босна и Херцеговина',
			en: 'Bosnia and Herzegovina',
			de: 'Bosnien und Herzegowina',
			fr: 'Bosnie-Herzégovine',
			it: 'Bosnia ed Erzegovina',
			sl: 'Bosna in Hercegovina',
			tr: 'Bosna Hersek',
			uk: 'Боснія і Герцеговина',
			pl: 'Bośnia i Hercegowina',
		},
	},
	{
		path: 'me',
		flagCode: 'me',
		instance: 'balkan',
		defaultLocale: 'sr-latn',
		names: {
			'sr-latn': 'Crna Gora',
			hr: 'Crna Gora',
			mk: 'Црна Гора',
			en: 'Montenegro',
			de: 'Montenegro',
			fr: 'Monténégro',
			it: 'Montenegro',
			sl: 'Črna gora',
			tr: 'Karadağ',
			uk: 'Чорногорія',
			pl: 'Czarnogóra',
		},
	},
	{
		path: 'mk',
		flagCode: 'mk',
		instance: 'balkan',
		defaultLocale: 'mk',
		names: {
			'sr-latn': 'S. Makedonija',
			hr: 'Sjeverna Makedonija',
			mk: 'С. Македонија',
			en: 'North Macedonia',
			de: 'Nordmazedonien',
			fr: 'Macédoine du Nord',
			it: 'Macedonia del Nord',
			sl: 'Severna Makedonija',
			tr: 'Kuzey Makedonya',
			uk: 'Північна Македонія',
			pl: 'Macedonia Północna',
		},
	},
	{
		path: 'de',
		flagCode: 'de',
		instance: 'global',
		defaultLocale: 'de',
		names: {
			'sr-latn': 'Nemačka',
			hr: 'Njemačka',
			mk: 'Германија',
			en: 'Germany',
			de: 'Deutschland',
			fr: 'Allemagne',
			it: 'Germania',
			sl: 'Nemčija',
			tr: 'Almanya',
			uk: 'Німеччина',
			pl: 'Niemcy',
		},
	},
	{
		path: 'fr',
		flagCode: 'fr',
		instance: 'global',
		defaultLocale: 'fr',
		names: {
			'sr-latn': 'Francuska',
			hr: 'Francuska',
			mk: 'Франција',
			en: 'France',
			de: 'Frankreich',
			fr: 'France',
			it: 'Francia',
			sl: 'Francija',
			tr: 'Fransa',
			uk: 'Франція',
			pl: 'Francja',
		},
	},
	{
		path: 'it',
		flagCode: 'it',
		instance: 'global',
		defaultLocale: 'it',
		names: {
			'sr-latn': 'Italija',
			hr: 'Italija',
			mk: 'Италија',
			en: 'Italy',
			de: 'Italien',
			fr: 'Italie',
			it: 'Italia',
			sl: 'Italija',
			tr: 'İtalya',
			uk: 'Італія',
			pl: 'Włochy',
		},
	},
	{
		path: 'ch',
		flagCode: 'ch',
		instance: 'global',
		defaultLocale: 'de',
		names: {
			'sr-latn': 'Švajcarska',
			hr: 'Švicarska',
			mk: 'Швајцарија',
			en: 'Switzerland',
			de: 'Schweiz',
			fr: 'Suisse',
			it: 'Svizzera',
			sl: 'Švica',
			tr: 'İsviçre',
			uk: 'Швейцарія',
			pl: 'Szwajcaria',
		},
	},
	{
		path: 'at',
		flagCode: 'at',
		instance: 'global',
		defaultLocale: 'de',
		names: {
			'sr-latn': 'Austrija',
			hr: 'Austrija',
			mk: 'Австрија',
			en: 'Austria',
			de: 'Österreich',
			fr: 'Autriche',
			it: 'Austria',
			sl: 'Avstrija',
			tr: 'Avusturya',
			uk: 'Австрія',
			pl: 'Austria',
		},
	},
	{
		path: 'si',
		flagCode: 'si',
		instance: 'global',
		defaultLocale: 'sl',
		names: {
			'sr-latn': 'Slovenija',
			hr: 'Slovenija',
			mk: 'Словенија',
			en: 'Slovenia',
			de: 'Slowenien',
			fr: 'Slovénie',
			it: 'Slovenia',
			sl: 'Slovenija',
			tr: 'Slovenya',
			uk: 'Словенія',
			pl: 'Słowenia',
		},
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
