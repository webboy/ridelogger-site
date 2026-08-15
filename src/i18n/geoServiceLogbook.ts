import type { Locale } from './config';
import type { GeoIntentLandingContent } from '../types/geoIntentLanding';

import srLatn from './messages/geo/service-logbook/sr-latn.json';
import de from './messages/geo/service-logbook/de.json';
import en from './messages/geo/service-logbook/en.json';

function cast(m: unknown): GeoIntentLandingContent {
	return m as GeoIntentLandingContent;
}

const BY_LOCALE: Partial<Record<Locale, GeoIntentLandingContent>> = {
	'sr-latn': cast(srLatn),
	de: cast(de),
	en: cast(en),
};

/** sr/ba/me → sr-latn; at/ch → de; us → en. */
export function geoServiceLogbookContent(locale: Locale): GeoIntentLandingContent {
	const c = BY_LOCALE[locale];
	if (!c) {
		throw new Error(`GEO service-logbook: no copy for locale "${locale}"`);
	}
	return c;
}
