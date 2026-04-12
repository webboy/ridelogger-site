import { LOCALE_HREFLANG, LOCALE_LABELS, type Locale } from '../i18n/config';
import { localeFromLangQueryParam } from '../i18n/langFromQuery';
import type { HomeMessages } from '../types/home';
import type { LegalBundle } from '../i18n/loadLegal';
import { renderCookieArticleHtml } from '../utils/renderCookieArticleHtml';
import { renderPrivacyArticleHtml } from '../utils/renderPrivacyArticleHtml';

export type MarketingLocaleInit = {
	homes: Record<Locale, HomeMessages>;
	defaultLocale: Locale;
	/** `null` = landing page (uses `marketing_ui_locale_landing`). */
	countryPath: string | null;
	publicAppBase: string;
	appCountryCode: string | null;
	legalPage?: 'privacy' | 'cookies';
	legals?: Record<Locale, LegalBundle>;
	privacyUrl?: string;
};

function storageKey(countryPath: string | null): string {
	return countryPath ? `marketing_ui_locale_${countryPath}` : 'marketing_ui_locale_landing';
}

function resolveLocale(init: MarketingLocaleInit): Locale {
	const homeKeys = Object.keys(init.homes) as Locale[];

	const q = new URLSearchParams(window.location.search).get('lang');
	const fromQ = localeFromLangQueryParam(q);
	if (fromQ && homeKeys.includes(fromQ)) {
		if (!init.legals || init.legals[fromQ]) return fromQ;
	}

	try {
		const s = localStorage.getItem(storageKey(init.countryPath));
		if (s && homeKeys.includes(s as Locale)) {
			const loc = s as Locale;
			if (!init.legals || init.legals[loc]) return loc;
		}
	} catch {
		/* ignore */
	}

	return init.defaultLocale;
}

function documentLang(loc: Locale): string {
	if (loc === 'sr-latn') return 'sr-Latn';
	if (loc === 'sr-cyrl') return 'sr-Cyrl';
	return loc;
}

function setMetaDescription(content: string) {
	const el = document.querySelector('meta[name="description"]');
	if (el) el.setAttribute('content', content);
}

function syncLangSwitcher(loc: Locale) {
	document.querySelectorAll('details.lang-switcher summary').forEach((summary) => {
		summary.setAttribute('aria-label', LOCALE_LABELS[loc]);
	});
	document.querySelectorAll('[data-locale-pick]').forEach((btn) => {
		const v = btn.getAttribute('data-locale-pick');
		const active = v === loc;
		btn.classList.toggle('is-active', active);
		if (active) btn.setAttribute('aria-current', 'true');
		else btn.removeAttribute('aria-current');
	});
}

function replaceLegalArticle(init: MarketingLocaleInit, loc: Locale) {
	if (!init.legalPage || !init.legals) return;
	const bundle = init.legals[loc];
	if (!bundle) return;

	const article = document.querySelector('.legal.shell .legal-article');
	if (!article) return;

	if (init.legalPage === 'privacy') {
		article.outerHTML = renderPrivacyArticleHtml(bundle);
	} else {
		const privacyUrl = init.privacyUrl ?? '';
		article.outerHTML = renderCookieArticleHtml(bundle, privacyUrl);
	}
}

export function initMarketingLocale(init: MarketingLocaleInit): void {
	function brandLabel(loc: Locale): string {
		return loc === 'sr-latn' || loc === 'sr-cyrl' || loc === 'hr' || loc === 'mk'
			? 'Servisna Knjižica'
			: 'RideLogger';
	}

	function getPath(obj: unknown, path: string): string | undefined {
		const v = path.split('.').reduce((o: unknown, k) => {
			if (o == null) return o;
			const n = Number(k);
			return Number.isNaN(n) ? (o as Record<string, unknown>)[k] : (o as unknown[])[n];
		}, obj);
		return typeof v === 'string' ? v : undefined;
	}

	function appHref(loc: Locale): string {
		try {
			const u = new URL(init.publicAppBase);
			const tag = LOCALE_HREFLANG[loc] || 'en';
			u.searchParams.set('lang', tag);
			if (init.appCountryCode && init.appCountryCode.length === 2) {
				u.searchParams.set('country', String(init.appCountryCode).toUpperCase());
			}
			return u.href;
		} catch {
			return init.publicAppBase;
		}
	}

	function apply(loc: Locale) {
		const m = init.homes[loc];
		if (!m) return;

		document.querySelectorAll('[data-hk]').forEach((el) => {
			const key = el.getAttribute('data-hk');
			if (!key) return;
			const v = getPath(m, key);
			if (typeof v === 'string') el.textContent = v;
		});

		document.querySelectorAll('[data-hk-alt]').forEach((el) => {
			const key = el.getAttribute('data-hk-alt');
			if (!key) return;
			const v = getPath(m, key);
			if (typeof v === 'string') el.setAttribute('alt', v);
		});

		document.querySelectorAll('[data-app-link]').forEach((el) => {
			el.setAttribute('href', appHref(loc));
		});

		document.querySelectorAll('[data-brand-text]').forEach((el) => {
			el.textContent = brandLabel(loc);
		});

		document.querySelectorAll('[data-brand-line]').forEach((el) => {
			const desc = getPath(m, 'meta.description');
			if (typeof desc === 'string') el.textContent = brandLabel(loc) + ' — ' + desc;
		});

		if (init.legalPage && init.legals) {
			const leg = init.legals[loc];
			if (leg) {
				if (init.legalPage === 'privacy') {
					document.title = leg.privacy_v2.meta_title;
					setMetaDescription(leg.privacy_v2.meta_description);
				} else {
					document.title = leg.cookie_policy.meta_title;
					setMetaDescription(leg.cookie_policy.meta_description);
				}
			}
		} else if (m.meta && typeof m.meta.title === 'string') {
			document.title = m.meta.title;
			if (typeof m.meta.description === 'string') setMetaDescription(m.meta.description);
		}

		try {
			localStorage.setItem(storageKey(init.countryPath), loc);
		} catch {
			/* ignore */
		}

		document.documentElement.lang = documentLang(loc);
		syncLangSwitcher(loc);
		replaceLegalArticle(init, loc);
	}

	function bindLocalePicks() {
		document.querySelectorAll('[data-locale-pick]').forEach((btn) => {
			btn.addEventListener('click', () => {
				const v = btn.getAttribute('data-locale-pick');
				if (v && init.homes[v as Locale]) apply(v as Locale);
			});
		});
	}

	const loc = resolveLocale(init);

	function go() {
		apply(loc);
		bindLocalePicks();
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', go);
	} else {
		go();
	}
}
