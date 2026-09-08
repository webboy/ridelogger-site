import { test, expect } from '@playwright/test';

function sitemapLocUrls(xml: string): string[] {
	const re = /<loc>([^<]+)<\/loc>/g;
	const urls: string[] = [];
	let m: RegExpExecArray | null;
	while ((m = re.exec(xml)) !== null) {
		urls.push(m[1]);
	}
	return urls;
}

const RL_ORIGIN = 'https://www.ridelogger.com';
const SK_ORIGIN = 'https://www.servisna-knjizica.com';

function hreflangLinks(html: string): { hreflang: string; href: string }[] {
	const re = /<link[^>]+rel="alternate"[^>]+hreflang="([^"]+)"[^>]+href="([^"]+)"/g;
	const links: { hreflang: string; href: string }[] = [];
	let m: RegExpExecArray | null;
	while ((m = re.exec(html)) !== null) {
		links.push({ hreflang: m[1], href: m[2] });
	}
	return links;
}

function jsonLdGraph(html: string): unknown[] {
	const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/;
	const m = html.match(re);
	if (!m) return [];
	const parsed = JSON.parse(m[1]) as { '@graph'?: unknown[] };
	return parsed['@graph'] ?? [];
}

test.describe('GEO crawl artifacts (global)', () => {
	test('robots.txt allows search bots and points to sitemap', async ({ request }) => {
		const res = await request.get('/robots.txt');
		expect(res.status()).toBe(200);
		const body = await res.text();
		expect(body).toContain('OAI-SearchBot');
		expect(body).toContain('PerplexityBot');
		expect(body).toContain('GPTBot');
		expect(body).toContain(`Sitemap: ${RL_ORIGIN}/sitemap.xml`);
	});

	test('sitemap lists global countries only', async ({ request }) => {
		const res = await request.get('/sitemap.xml');
		expect(res.status()).toBe(200);
		const body = await res.text();
		const locs = sitemapLocUrls(body);
		expect(locs.some((u) => u.startsWith(`${RL_ORIGIN}/de/`))).toBe(true);
		expect(locs.some((u) => u.startsWith(`${RL_ORIGIN}/us/`))).toBe(true);
		expect(locs.every((u) => u.startsWith(RL_ORIGIN))).toBe(true);
		expect(locs.some((u) => u.includes('/us/private-sellers/'))).toBe(false);
		// Cross-domain alternates appear in xhtml:link, not as primary loc entries.
		expect(body).toContain(`${SK_ORIGIN}/sr/`);
	});

	test('llms.txt is available', async ({ request }) => {
		const res = await request.get('/llms.txt');
		expect(res.status()).toBe(200);
		const body = await res.text();
		expect(body).toContain(RL_ORIGIN);
	});

	test('/de/ home has cross-domain hreflang and x-default', async ({ request }) => {
		const res = await request.get('/de/');
		expect(res.status()).toBe(200);
		const html = await res.text();
		const links = hreflangLinks(html);
		expect(links.some((l) => l.hreflang === 'sr-Latn' && l.href === `${SK_ORIGIN}/sr/`)).toBe(true);
		expect(links.some((l) => l.hreflang === 'x-default' && l.href === `${RL_ORIGIN}/us/`)).toBe(true);
	});

	test('/at/ home has de-AT hreflang', async ({ request }) => {
		const res = await request.get('/at/');
		const html = await res.text();
		const links = hreflangLinks(html);
		expect(links.some((l) => l.hreflang === 'de-AT' && l.href === `${RL_ORIGIN}/at/`)).toBe(true);
	});

	test('/us/ home is English with JSON-LD sameAs', async ({ request }) => {
		const res = await request.get('/us/');
		const html = await res.text();
		expect(html).toMatch(/<html lang="en"/);
		const graph = jsonLdGraph(html);
		const withSameAs = graph.find(
			(n) =>
				typeof n === 'object' &&
				n !== null &&
				'sameAs' in n &&
				Array.isArray((n as { sameAs: string[] }).sameAs),
		) as { sameAs: string[] } | undefined;
		expect(withSameAs?.sameAs).toEqual(expect.arrayContaining([RL_ORIGIN, SK_ORIGIN]));
	});

	test('/us/private-sellers/ is not built', async ({ request }) => {
		const res = await request.get('/us/private-sellers/');
		expect(res.status()).not.toBe(200);
	});

	test('/de/private-sellers/ hreflang to SK campaign', async ({ request }) => {
		const res = await request.get('/de/private-sellers/');
		expect(res.status()).toBe(200);
		const html = await res.text();
		const links = hreflangLinks(html);
		expect(
			links.some((l) => l.hreflang === 'sr-Latn' && l.href === `${SK_ORIGIN}/sr/prodaja-auta/`),
		).toBe(true);
		expect(links.some((l) => l.hreflang === 'x-default' && l.href === `${RL_ORIGIN}/us/`)).toBe(
			true,
		);
	});

	test('/us/account-deletion/ names RideLogger, Servisna Knjižica and Green Line Trading LTD', async ({
		request,
	}) => {
		const res = await request.get('/us/account-deletion/');
		expect(res.status()).toBe(200);
		const html = await res.text();
		expect(html).toContain('RideLogger');
		expect(html).toContain('Servisna Knjižica');
		expect(html).toContain('Green Line Trading LTD');
		const links = hreflangLinks(html);
		expect(
			links.some((l) => l.hreflang === 'sr-Latn' && l.href === `${SK_ORIGIN}/sr/account-deletion/`),
		).toBe(true);
	});

	test('/us/data-deletion/ names RideLogger, Servisna Knjižica and Green Line Trading LTD', async ({
		request,
	}) => {
		const res = await request.get('/us/data-deletion/');
		expect(res.status()).toBe(200);
		const html = await res.text();
		expect(html).toContain('RideLogger');
		expect(html).toContain('Servisna Knjižica');
		expect(html).toContain('Green Line Trading LTD');
	});

	test('sitemap lists Play deletion URLs', async ({ request }) => {
		const res = await request.get('/sitemap.xml');
		const body = await res.text();
		expect(body).toContain(`${RL_ORIGIN}/us/account-deletion/`);
		expect(body).toContain(`${RL_ORIGIN}/us/data-deletion/`);
	});
});
