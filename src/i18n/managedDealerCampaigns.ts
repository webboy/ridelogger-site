import type { Locale } from './config';
import type { ManagedDealerLandingContent } from '../types/managedDealerLanding';

import skSrManaged from './messages/autoSeller/sk-sr-managed-dealers.json';
import skHrManaged from './messages/autoSeller/sk-hr-managed-dealers.json';
import skMkManaged from './messages/autoSeller/sk-mk-managed-dealers.json';

import rlDeManaged from './messages/autoSeller/rl-de-managed-dealers.json';
import rlFrManaged from './messages/autoSeller/rl-fr-managed-dealers.json';
import rlItManaged from './messages/autoSeller/rl-it-managed-dealers.json';
import rlSlManaged from './messages/autoSeller/rl-sl-managed-dealers.json';

function cast(m: unknown): ManagedDealerLandingContent {
	return m as ManagedDealerLandingContent;
}

const SK_MANAGED: Partial<Record<Locale, ManagedDealerLandingContent>> = {
	'sr-latn': cast(skSrManaged),
	hr: cast(skHrManaged),
	mk: cast(skMkManaged),
};

const RL_MANAGED: Partial<Record<Locale, ManagedDealerLandingContent>> = {
	de: cast(rlDeManaged),
	fr: cast(rlFrManaged),
	it: cast(rlItManaged),
	sl: cast(rlSlManaged),
};

function pick(map: Partial<Record<Locale, ManagedDealerLandingContent>>, locale: Locale, label: string): ManagedDealerLandingContent {
	const c = map[locale];
	if (!c) {
		throw new Error(`${label}: no managed dealer campaign copy for locale "${locale}"`);
	}
	return c;
}

export function skManagedDealersCampaign(locale: Locale): ManagedDealerLandingContent {
	return pick(SK_MANAGED, locale, 'SK managed dealers');
}

export function rlManagedDealersCampaign(locale: Locale): ManagedDealerLandingContent {
	return pick(RL_MANAGED, locale, 'RL managed dealers');
}
