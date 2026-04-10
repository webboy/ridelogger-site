import type { HomeMessages } from '../types/home';
import type { Locale } from './config';
import de from './messages/home/de.json';
import en from './messages/home/en.json';
import fr from './messages/home/fr.json';
import hr from './messages/home/hr.json';
import it from './messages/home/it.json';
import mk from './messages/home/mk.json';
import pl from './messages/home/pl.json';
import sl from './messages/home/sl.json';
import srCyrl from './messages/home/sr-cyrl.json';
import srLatn from './messages/home/sr-latn.json';
import tr from './messages/home/tr.json';
import uk from './messages/home/uk.json';

const byLocale: Record<Locale, HomeMessages> = {
	en: en as HomeMessages,
	de: de as HomeMessages,
	fr: fr as HomeMessages,
	hr: hr as HomeMessages,
	it: it as HomeMessages,
	mk: mk as HomeMessages,
	sl: sl as HomeMessages,
	tr: tr as HomeMessages,
	uk: uk as HomeMessages,
	pl: pl as HomeMessages,
	'sr-latn': srLatn as HomeMessages,
	'sr-cyrl': srCyrl as HomeMessages,
};

export function getHomeMessages(locale: Locale): HomeMessages {
	return byLocale[locale];
}

export function getAllHomeMessages(): Record<Locale, HomeMessages> {
	return { ...byLocale };
}
