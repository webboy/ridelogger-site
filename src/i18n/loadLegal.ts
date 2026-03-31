import type { Locale } from './config';
import de from '../data/legal/de.json';
import en from '../data/legal/en.json';
import hr from '../data/legal/hr.json';
import srCyrl from '../data/legal/sr-cyrl.json';
import srLatn from '../data/legal/sr-latn.json';

export type LegalBundle = typeof en;

const byLocale: Record<Locale, LegalBundle> = {
	en: en as LegalBundle,
	de: de as LegalBundle,
	hr: hr as LegalBundle,
	'sr-latn': srLatn as LegalBundle,
	'sr-cyrl': srCyrl as LegalBundle,
};

export function getLegal(locale: Locale): LegalBundle {
	return byLocale[locale];
}
