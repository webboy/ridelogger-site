import type { LegalBundle } from '../i18n/loadLegal';
import { replacePrivacyUrl } from './legalReplace';

function raw(s: string): string {
	return s;
}

function esc(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

/** Server + client: cookie policy HTML (matches `CookieArticle.astro`). */
export function renderCookieArticleHtml(legal: LegalBundle, privacyUrl: string): string {
	const c = legal.cookie_policy;
	const intro = replacePrivacyUrl(c.intro_note, privacyUrl);
	const manage = replacePrivacyUrl(c.manage_body, privacyUrl);

	return `<article class="legal-article">
	<p class="legal-meta">${esc(c.updated_line)}</p>
	<h1>${esc(c.h1)}</h1>
	<p class="muted">${raw(intro)}</p>

	<h2>${esc(c.owner_title)}</h2>
	<p>${esc(c.owner_intro)}</p>
	<ul>
		<li>${raw(c.owner_li_name)}</li>
		<li>${raw(c.owner_li_address)}</li>
		<li>${raw(c.owner_li_phone)}</li>
		<li>${raw(c.owner_li_website)}</li>
	</ul>

	<h2>${esc(c.what_title)}</h2>
	<p>${esc(c.what_body)}</p>

	<h2>${esc(c.types_title)}</h2>
	<p>${esc(c.types_intro)}</p>
	<h3>${esc(c.type_essential_title)}</h3>
	<p>${esc(c.type_essential_body)}</p>
	<h3>${esc(c.type_functional_title)}</h3>
	<p>${esc(c.type_functional_body)}</p>
	<h3>${esc(c.type_analytics_title)}</h3>
	<p>${esc(c.type_analytics_body)}</p>
	<h3>${esc(c.type_marketing_title)}</h3>
	<p>${esc(c.type_marketing_body)}</p>

	<h2>${esc(c.third_party_title)}</h2>
	<p>${esc(c.third_party_body)}</p>
	<ul>
		<li>${esc(c.tp_ga)}</li>
		<li>${esc(c.tp_fb)}</li>
	</ul>

	<h2>${esc(c.retention_title)}</h2>
	<p>${esc(c.retention_body)}</p>

	<h2>${esc(c.manage_title)}</h2>
	<p>${raw(manage)}</p>

	<h2>${esc(c.changes_title)}</h2>
	<p>${esc(c.changes_body)}</p>

	<h2>${esc(c.contact_title)}</h2>
	<p>${esc(c.contact_intro)}</p>
	<ul>
		<li>${raw(c.contact_li_company)}</li>
		<li>${raw(c.contact_li_address)}</li>
		<li>${raw(c.contact_li_phone)}</li>
		<li>${raw(c.contact_li_website)}</li>
	</ul>
</article>`;
}
