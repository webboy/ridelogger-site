import type { LegalBundle } from '../i18n/loadLegal';
import { replacePrivacyUrl } from './legalReplace';

function esc(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

/** Server + client: HTML for Terms of Service (matches `TosArticle.astro`). */
export function renderTosArticleHtml(legal: LegalBundle, privacyUrl: string): string {
	const t = legal.tos;
	const body = replacePrivacyUrl(t.content_html, privacyUrl);
	return `<article class="legal-article">
	<p class="legal-meta">${esc(t.updated_line)}</p>
	<h1>${esc(t.h1)}</h1>
	${body}
</article>`;
}
