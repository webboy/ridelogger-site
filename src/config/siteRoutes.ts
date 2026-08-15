import {
	COUNTRY_PAGES,
	countryPagesForInstance,
	getCountryByPath,
	type DeployInstance,
} from './countries';

/** Canonical marketing origins (always www). */
export const MARKETING_ORIGINS = {
	balkan: 'https://www.servisna-knjizica.com',
	global: 'https://www.ridelogger.com',
} as const;

/** EN hub country path on the global instance. */
export const EN_HUB_COUNTRY = 'us';

export type RouteFamily =
	| 'home'
	| 'privacy'
	| 'terms'
	| 'cookies'
	| 'mcp'
	| 'campaign-private'
	| 'campaign-dealers'
	| 'campaign-managed'
	| 'geo-service-logbook';

/** Shared legal / MCP slugs (same on both instances). */
export const SHARED_PATH_SUFFIXES = ['privacy', 'terms', 'cookies', 'mcp'] as const;

export type SharedPathSuffix = (typeof SHARED_PATH_SUFFIXES)[number];

/** Campaign slug pairs (global RL ↔ balkan SK). US emits none. */
export const CAMPAIGN_SUFFIX_BY_FAMILY: Record<
	'campaign-private' | 'campaign-dealers' | 'campaign-managed',
	{ global: string; balkan: string }
> = {
	'campaign-private': { global: 'private-sellers', balkan: 'prodaja-auta' },
	'campaign-dealers': { global: 'auto-dealers', balkan: 'auto-placevi' },
	'campaign-managed': { global: 'auto-dealers/managed', balkan: 'auto-placevi/managed' },
};

const CAMPAIGN_FAMILIES = ['campaign-private', 'campaign-dealers', 'campaign-managed'] as const;

/** Per-country GEO intent slug (task 0088). Hub locales only — not hr/mk/fr/it/si. */
export const GEO_SERVICE_LOGBOOK_SUFFIX_BY_COUNTRY: Record<string, string> = {
	sr: 'digitalna-servisna-knjizica',
	ba: 'digitalna-servisna-knjizica',
	me: 'digitalna-servisna-knjizica',
	de: 'digitales-serviceheft',
	at: 'digitales-serviceheft',
	ch: 'digitales-serviceheft',
	us: 'digital-service-logbook',
};

export const GEO_INTENT_BALKAN_COUNTRIES = ['sr', 'ba', 'me'] as const;
export const GEO_INTENT_DE_COUNTRIES = ['de', 'at', 'ch'] as const;
export const GEO_INTENT_EN_COUNTRIES = ['us'] as const;

/** US has no campaign pages (no EN campaign copy). */
export function countryEmitsCampaigns(countryPath: string): boolean {
	return countryPath !== EN_HUB_COUNTRY;
}

/** Country emits a GEO service-logbook intent page (sr/de/en hubs only). */
export function countryEmitsGeoIntent(countryPath: string): boolean {
	return countryPath in GEO_SERVICE_LOGBOOK_SUFFIX_BY_COUNTRY;
}

export function geoIntentSuffixForCountry(countryPath: string): string | null {
	return GEO_SERVICE_LOGBOOK_SUFFIX_BY_COUNTRY[countryPath] ?? null;
}

export function marketingOriginForInstance(instance: DeployInstance): string {
	return MARKETING_ORIGINS[instance];
}

export function originForCountryPath(countryPath: string): string {
	const cfg = getCountryByPath(countryPath);
	if (!cfg) {
		throw new Error(`Unknown country path: ${countryPath}`);
	}
	return marketingOriginForInstance(cfg.instance);
}

/** BCP 47 hreflang for a country URL segment (not the UI locale switcher). */
export function countryHreflang(countryPath: string): string {
	switch (countryPath) {
		case 'sr':
			return 'sr-Latn';
		case 'ba':
			return 'sr-Latn-BA';
		case 'me':
			return 'sr-Latn-ME';
		case 'de':
			return 'de';
		case 'at':
			return 'de-AT';
		case 'ch':
			return 'de-CH';
		case 'us':
			return 'en';
		case 'hr':
			return 'hr';
		case 'mk':
			return 'mk';
		case 'fr':
			return 'fr';
		case 'it':
			return 'it';
		case 'si':
			return 'sl';
		default:
			throw new Error(`No hreflang mapping for country: ${countryPath}`);
	}
}

export function pathSuffixToFamily(pathSuffix: string): RouteFamily {
	if (pathSuffix === '') return 'home';
	if (pathSuffix === 'privacy') return 'privacy';
	if (pathSuffix === 'terms') return 'terms';
	if (pathSuffix === 'cookies') return 'cookies';
	if (pathSuffix === 'mcp') return 'mcp';

	for (const family of CAMPAIGN_FAMILIES) {
		const pair = CAMPAIGN_SUFFIX_BY_FAMILY[family];
		if (pathSuffix === pair.global || pathSuffix === pair.balkan) {
			return family;
		}
	}

	if (Object.values(GEO_SERVICE_LOGBOOK_SUFFIX_BY_COUNTRY).includes(pathSuffix)) {
		return 'geo-service-logbook';
	}

	throw new Error(`Unknown path suffix: ${pathSuffix}`);
}

/** Path suffix for a country + route family, or null if that country does not emit the page. */
export function pathSuffixForCountry(countryPath: string, family: RouteFamily): string | null {
	const cfg = getCountryByPath(countryPath);
	if (!cfg) return null;

	switch (family) {
		case 'home':
			return '';
		case 'privacy':
		case 'terms':
		case 'cookies':
		case 'mcp':
			return family;
		case 'campaign-private':
		case 'campaign-dealers':
		case 'campaign-managed':
			if (!countryEmitsCampaigns(countryPath)) return null;
			return CAMPAIGN_SUFFIX_BY_FAMILY[family][cfg.instance];
		case 'geo-service-logbook':
			return geoIntentSuffixForCountry(countryPath);
		default:
			return null;
	}
}

export function absolutePageUrl(origin: string, countryPath: string, pathSuffix: string): string {
	const tail = pathSuffix === '' ? `${countryPath}/` : `${countryPath}/${pathSuffix}/`;
	return new URL(tail, origin.endsWith('/') ? origin : `${origin}/`).href;
}

/** x-default target: EN hub home, or EN equivalent path when it exists on global. */
export function xDefaultUrlForFamily(family: RouteFamily): string {
	const origin = MARKETING_ORIGINS.global;
	const suffix = pathSuffixForCountry(EN_HUB_COUNTRY, family);
	if (suffix === null) {
		return absolutePageUrl(origin, EN_HUB_COUNTRY, '');
	}
	return absolutePageUrl(origin, EN_HUB_COUNTRY, suffix);
}

export type SitePageRef = {
	countryPath: string;
	pathSuffix: string;
	family: RouteFamily;
};

/** All crawlable pages for one build instance (used by sitemap + llms.txt). */
export function sitePagesForInstance(instance: DeployInstance): SitePageRef[] {
	const pages: SitePageRef[] = [];
	const families: RouteFamily[] = [
		'home',
		'privacy',
		'terms',
		'cookies',
		'mcp',
		'campaign-private',
		'campaign-dealers',
		'campaign-managed',
		'geo-service-logbook',
	];

	for (const cfg of countryPagesForInstance(instance)) {
		for (const family of families) {
			const suffix = pathSuffixForCountry(cfg.path, family);
			if (suffix === null) continue;
			pages.push({ countryPath: cfg.path, pathSuffix: suffix, family });
		}
	}

	return pages;
}

/** Countries (both instances) that emit a given route family. */
export function countriesForFamily(family: RouteFamily): string[] {
	return COUNTRY_PAGES.filter((c) => pathSuffixForCountry(c.path, family) !== null).map((c) => c.path);
}

/** Root picker: hreflang to every country home + x-default EN hub. */
export function pickerHreflangAlternates(): { href: string; hreflang: string }[] {
	const alternates = COUNTRY_PAGES.map((c) => ({
		href: absolutePageUrl(originForCountryPath(c.path), c.path, ''),
		hreflang: countryHreflang(c.path),
	}));
	alternates.push({
		href: xDefaultUrlForFamily('home'),
		hreflang: 'x-default',
	});
	return alternates;
}
