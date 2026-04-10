import type { Locale } from './config';
import de from '../data/legal/de.json';
import en from '../data/legal/en.json';
import fr from '../data/legal/fr.json';
import hr from '../data/legal/hr.json';
import it from '../data/legal/it.json';
import mk from '../data/legal/mk.json';
import sl from '../data/legal/sl.json';
import srCyrl from '../data/legal/sr-cyrl.json';
import srLatn from '../data/legal/sr-latn.json';

export type LegalBundle = typeof en;

const byLocale: Record<Locale, LegalBundle> = {
	en: en as LegalBundle,
	de: de as LegalBundle,
	fr: fr as LegalBundle,
	hr: hr as LegalBundle,
	it: it as LegalBundle,
	mk: mk as LegalBundle,
	sl: sl as LegalBundle,
	'sr-latn': srLatn as LegalBundle,
	'sr-cyrl': srCyrl as LegalBundle,
};

export function getLegal(locale: Locale): LegalBundle {
	return byLocale[locale];
}
