import type { LegalBundle } from '../i18n/loadLegal';

function esc(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

export type DeletionKind = 'account' | 'data';

function bundleFor(legal: LegalBundle, kind: DeletionKind) {
	return kind === 'account' ? legal.account_deletion : legal.data_deletion;
}

/** Server + client: HTML for Play Data safety deletion pages. */
export function renderDeletionArticleHtml(legal: LegalBundle, kind: DeletionKind): string {
	const d = bundleFor(legal, kind);
	return `<article class="legal-article">
	<p class="legal-meta">${esc(d.updated_line)}</p>
	<h1>${esc(d.h1)}</h1>
	<p>${esc(d.intro)}</p>
	<h2>${esc(d.how_title)}</h2>
	<p>${esc(d.how_intro)}</p>
	<ol>
		<li>${esc(d.li1)}</li>
		<li>${esc(d.li2)}</li>
		<li>${esc(d.li3)}</li>
	</ol>
	<h2>${esc(d.timing_title)}</h2>
	<p>${esc(d.timing)}</p>
	<p>${esc(d.operator)}</p>
</article>`;
}
