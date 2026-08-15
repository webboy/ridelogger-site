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

test.describe('GEO crawl artifacts (balkan)', () => {
	test('robots.txt points to SK sitemap', async ({ request }) => {
		const res = await request.get('/robots.txt');
		expect(res.status()).toBe(200);
		const body = await res.text();
		expect(body).toContain(`Sitemap: ${SK_ORIGIN}/sitemap.xml`);
	});

	test('sitemap lists balkan countries only', async ({ request }) => {
		const res = await request.get('/sitemap.xml');
		expect(res.status()).toBe(200);
		const body = await res.text();
		const locs = sitemapLocUrls(body);
		expect(locs.some((u) => u.startsWith(`${SK_ORIGIN}/sr/`))).toBe(true);
		expect(locs.some((u) => u.startsWith(`${SK_ORIGIN}/ba/`))).toBe(true);
		expect(locs.every((u) => u.startsWith(SK_ORIGIN))).toBe(true);
	});

	test('llms.txt is available', async ({ request }) => {
		const res = await request.get('/llms.txt');
		expect(res.status()).toBe(200);
		const body = await res.text();
		expect(body).toContain(SK_ORIGIN);
	});

	test('/sr/ home has cross-domain hreflang to DE', async ({ request }) => {
		const res = await request.get('/sr/');
		expect(res.status()).toBe(200);
		const html = await res.text();
		const links = hreflangLinks(html);
		expect(links.some((l) => l.hreflang === 'de' && l.href === `${RL_ORIGIN}/de/`)).toBe(true);
	});

	test('/ba/ home has sr-Latn-BA hreflang', async ({ request }) => {
		const res = await request.get('/ba/');
		const html = await res.text();
		const links = hreflangLinks(html);
		expect(links.some((l) => l.hreflang === 'sr-Latn-BA' && l.href === `${SK_ORIGIN}/ba/`)).toBe(
			true,
		);
	});

	test('/sr/ home JSON-LD sameAs both origins', async ({ request }) => {
		const res = await request.get('/sr/');
		const html = await res.text();
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
});
