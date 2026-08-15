import {
	absolutePageUrl,
	countriesForFamily,
	countryHreflang,
	originForCountryPath,
	pathSuffixForCountry,
	pathSuffixToFamily,
	xDefaultUrlForFamily,
} from './siteRoutes';

export type HreflangAlternate = {
	href: string;
	hreflang: string;
};

/**
 * Alternate links for a country page, including cross-domain SK↔RL peers.
 * `pathSuffix` matches SiteLayout (e.g. `privacy`, `private-sellers`, `` for home).
 * Campaign pairs use the correct slug per instance (private-sellers ↔ prodaja-auta).
 */
export function hreflangAlternates(options: {
	countryPath: string;
	pathSuffix?: string;
}): HreflangAlternate[] {
	const pathSuffix = options.pathSuffix ?? '';
	const family = pathSuffixToFamily(pathSuffix);
	const countryPaths = countriesForFamily(family);

	const alternates: HreflangAlternate[] = countryPaths.map((cp) => {
		const suffix = pathSuffixForCountry(cp, family);
		if (suffix === null) {
			throw new Error(`Country ${cp} missing suffix for family ${family}`);
		}
		return {
			href: absolutePageUrl(originForCountryPath(cp), cp, suffix),
			hreflang: countryHreflang(cp),
		};
	});

	alternates.push({
		href: xDefaultUrlForFamily(family),
		hreflang: 'x-default',
	});

	return alternates;
}
