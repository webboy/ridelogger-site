import type { LegalBundle } from '../i18n/loadLegal';

/** Trusted HTML fragments from JSON (same as `set:html` in `PrivacyArticle.astro`). */
function raw(s: string): string {
	return s;
}

/** Plain text nodes (Astro `{x}` escaping). */
function esc(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

/** Server + client: HTML for privacy policy (matches `PrivacyArticle.astro`). */
export function renderPrivacyArticleHtml(legal: LegalBundle): string {
	const p = legal.privacy_v2;
	return `<article class="legal-article">
	<p class="legal-meta">${esc(p.updated_line)}</p>
	<h1>${esc(p.h1)}</h1>

	<h2>${esc(p.s1_title)}</h2>
	<p>${esc(p.s1_intro)}</p>
	<ul>
		<li>${raw(p.s1_li_company)}</li>
		<li>${raw(p.s1_li_address)}</li>
		<li>${raw(p.s1_li_phone)}</li>
		<li>${raw(p.s1_li_website)}</li>
		<li>${raw(p.s1_li_email)}</li>
		<li>${raw(p.s1_li_registry)}</li>
	</ul>
	<p>${esc(p.s1_dpo_intro)}</p>
	<ul>
		<li>${raw(p.s1_li_dpo)}</li>
		<li>${raw(p.s1_li_dpo_email)}</li>
	</ul>

	<h2>${esc(p.s2_title)}</h2>
	<p>${esc(p.s2_body)}</p>

	<h2>${esc(p.s3_title)}</h2>
	<p>${esc(p.s3_intro)}</p>
	<ol>
		<li>
			<strong>${esc(p.s3_cat1_title)}</strong> — ${esc(p.s3_cat1_text)}
		</li>
		<li>
			<strong>${esc(p.s3_cat2_title)}</strong> — ${esc(p.s3_cat2_text)}
		</li>
		<li>
			<strong>${esc(p.s3_cat3_title)}</strong> — ${esc(p.s3_cat3_text)}
		</li>
		<li>
			<strong>${esc(p.s3_cat4_title)}</strong> — ${esc(p.s3_cat4_text)}
		</li>
		<li>
			<strong>${esc(p.s3_cat5_title)}</strong> — ${esc(p.s3_cat5_text)}
		</li>
	</ol>

	<h2>${esc(p.s4_title)}</h2>
	<p>${esc(p.s4_intro)}</p>
	<ol>
		<li>
			<strong>${esc(p.s4_p1_title)}</strong>
			<ul>
				<li>${esc(p.s4_p1_a)}</li>
				<li>${esc(p.s4_p1_b)}</li>
			</ul>
		</li>
		<li>
			<strong>${esc(p.s4_p2_title)}</strong>
			<ul>
				<li>${esc(p.s4_p2_a)}</li>
				<li>${esc(p.s4_p2_b)}</li>
			</ul>
		</li>
		<li>
			<strong>${esc(p.s4_p3_title)}</strong> — ${esc(p.s4_p3_text)}
		</li>
		<li>
			<strong>${esc(p.s4_p4_title)}</strong>
			<ul>
				<li>${esc(p.s4_p4_a)}</li>
				<li>${esc(p.s4_p4_b)}</li>
			</ul>
		</li>
	</ol>
	<p>${esc(p.s4_consent_note)}</p>

	<h2>${esc(p.s5_title)}</h2>
	<p>${esc(p.s5_p1)}</p>
	<p>${esc(p.s5_p2)}</p>
	<ul>
		<li>${esc(p.s5_li1)}</li>
		<li>${esc(p.s5_li2)}</li>
	</ul>
	<p>${esc(p.s5_manage)}</p>

	<h2>${esc(p.s6_title)}</h2>
	<p>${esc(p.s6_intro)}</p>
	<ul>
		<li>${esc(p.s6_li1)}</li>
		<li>${esc(p.s6_li2)}</li>
		<li>${esc(p.s6_li3)}</li>
		<li>${esc(p.s6_li4)}</li>
		<li>${esc(p.s6_li5)}</li>
	</ul>
	<p>${esc(p.s6_outro)}</p>

	<h2>${esc(p.s7_title)}</h2>
	<p>${esc(p.s7_body)}</p>

	<h2>${esc(p.s8_title)}</h2>
	<p>${esc(p.s8_intro)}</p>
	<ul>
		<li>${esc(p.s8_li1)}</li>
		<li>${esc(p.s8_li2)}</li>
		<li>${esc(p.s8_li3)}</li>
		<li>${esc(p.s8_li4)}</li>
	</ul>

	<h2>${esc(p.s9_title)}</h2>
	<p>${esc(p.s9_intro)}</p>
	<ul>
		<li>${esc(p.s9_li1)}</li>
		<li>${esc(p.s9_li2)}</li>
		<li>${esc(p.s9_li3)}</li>
		<li>${esc(p.s9_li4)}</li>
		<li>${esc(p.s9_li5)}</li>
	</ul>

	<h2>${esc(p.s10_title)}</h2>
	<p>${esc(p.s10_intro)}</p>
	<ul>
		<li>${esc(p.s10_li1)}</li>
		<li>${esc(p.s10_li2)}</li>
		<li>${esc(p.s10_li3)}</li>
		<li>${esc(p.s10_li4)}</li>
		<li>${esc(p.s10_li5)}</li>
		<li>${esc(p.s10_li6)}</li>
		<li>${esc(p.s10_li7)}</li>
	</ul>
	<p>${raw(p.s10_request)}</p>
	<p>${esc(p.s10_complaint)}</p>

	<h2>${esc(p.s11_title)}</h2>
	<p>${esc(p.s11_body)}</p>

	<h2>${esc(p.s12_title)}</h2>
	<p>${esc(p.s12_body)}</p>

	<h2>${esc(p.s13_title)}</h2>
	<p>${esc(p.s13_intro)}</p>
	<ul>
		<li>${raw(p.s13_li_company)}</li>
		<li>${raw(p.s13_li_address)}</li>
		<li>${raw(p.s13_li_phone)}</li>
		<li>${raw(p.s13_li_website)}</li>
		<li>${raw(p.s13_li_email)}</li>
	</ul>
</article>`;
}
