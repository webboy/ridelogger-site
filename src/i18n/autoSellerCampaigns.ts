import type { Locale } from './config';
import type { AutoSellerLandingContent } from '../types/autoSellerLanding';

import skSrPrivate from './messages/autoSeller/sk-sr-private.json';
import skHrPrivate from './messages/autoSeller/sk-hr-private.json';
import skMkPrivate from './messages/autoSeller/sk-mk-private.json';
import skSrDealers from './messages/autoSeller/sk-sr-dealers.json';
import skHrDealers from './messages/autoSeller/sk-hr-dealers.json';
import skMkDealers from './messages/autoSeller/sk-mk-dealers.json';

import rlDePrivate from './messages/autoSeller/rl-de-private.json';
import rlFrPrivate from './messages/autoSeller/rl-fr-private.json';
import rlItPrivate from './messages/autoSeller/rl-it-private.json';
import rlSlPrivate from './messages/autoSeller/rl-sl-private.json';
import rlDeDealers from './messages/autoSeller/rl-de-dealers.json';
import rlFrDealers from './messages/autoSeller/rl-fr-dealers.json';
import rlItDealers from './messages/autoSeller/rl-it-dealers.json';
import rlSlDealers from './messages/autoSeller/rl-sl-dealers.json';

function cast(m: unknown): AutoSellerLandingContent {
	return m as AutoSellerLandingContent;
}

const SK_PRIVATE: Partial<Record<Locale, AutoSellerLandingContent>> = {
	'sr-latn': cast(skSrPrivate),
	hr: cast(skHrPrivate),
	mk: cast(skMkPrivate),
};

const SK_DEALERS: Partial<Record<Locale, AutoSellerLandingContent>> = {
	'sr-latn': cast(skSrDealers),
	hr: cast(skHrDealers),
	mk: cast(skMkDealers),
};

const RL_PRIVATE: Partial<Record<Locale, AutoSellerLandingContent>> = {
	de: cast(rlDePrivate),
	fr: cast(rlFrPrivate),
	it: cast(rlItPrivate),
	sl: cast(rlSlPrivate),
};

const RL_DEALERS: Partial<Record<Locale, AutoSellerLandingContent>> = {
	de: cast(rlDeDealers),
	fr: cast(rlFrDealers),
	it: cast(rlItDealers),
	sl: cast(rlSlDealers),
};

function pick(map: Partial<Record<Locale, AutoSellerLandingContent>>, locale: Locale, label: string): AutoSellerLandingContent {
	const c = map[locale];
	if (!c) {
		throw new Error(`${label}: no campaign copy for locale "${locale}"`);
	}
	return c;
}

export function skPrivateCampaign(locale: Locale): AutoSellerLandingContent {
	return pick(SK_PRIVATE, locale, 'SK private');
}

export function skDealersCampaign(locale: Locale): AutoSellerLandingContent {
	return pick(SK_DEALERS, locale, 'SK dealers');
}

export function rlPrivateCampaign(locale: Locale): AutoSellerLandingContent {
	return pick(RL_PRIVATE, locale, 'RL private');
}

export function rlDealersCampaign(locale: Locale): AutoSellerLandingContent {
	return pick(RL_DEALERS, locale, 'RL dealers');
}
