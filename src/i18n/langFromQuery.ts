import { isLocale, LOCALE_HREFLANG, type Locale } from './config';

/** Map `?lang=` (BCP-47 or short id) to a site locale. */
export function localeFromLangQueryParam(raw: string | null | undefined): Locale | null {
	if (raw == null) return null;
	const s = raw.trim();
	if (!s) return null;
	const norm = s.toLowerCase().replace(/_/g, '-');

	if (isLocale(norm)) return norm;

	if (norm === 'sr') return 'sr-latn';

	for (const loc of Object.keys(LOCALE_HREFLANG) as Locale[]) {
		const tag = LOCALE_HREFLANG[loc].toLowerCase();
		if (tag === norm) return loc;
	}

	return null;
}
