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

test.describe('GEO hub + intent (balkan)', () => {
	test('/sr/ home has definition in SSR HTML', async ({ request }) => {
		const res = await request.get('/sr/');
		expect(res.status()).toBe(200);
		const html = await res.text();
		expect(html).toContain('data-hk="hero.definition"');
		expect(html).toContain('digitalna servisna knjižica');
		expect(html).toContain('RideLogger');
	});

	test('/sr/digitalna-servisna-knjizica/ 200 with hreflang trio and CTA', async ({ request }) => {
		const res = await request.get('/sr/digitalna-servisna-knjizica/');
		expect(res.status()).toBe(200);
		const html = await res.text();
		expect(html).toContain('<h1');
		expect(html).toContain('digitalna servisna knjižica');
		const links = hreflangLinks(html);
		expect(
			links.some(
				(l) =>
					l.hreflang === 'de' &&
					l.href === `${RL_ORIGIN}/de/digitales-serviceheft/`,
			),
		).toBe(true);
		expect(
			links.some(
				(l) =>
					l.hreflang === 'en' &&
					l.href === `${RL_ORIGIN}/us/digital-service-logbook/`,
			),
		).toBe(true);
		expect(
			links.some(
				(l) =>
					l.hreflang === 'x-default' &&
					l.href === `${RL_ORIGIN}/us/digital-service-logbook/`,
			),
		).toBe(true);
		expect(html).toContain('app.servisna-knjizica.com');
		expect(html).toContain('data-app-link');
	});

	test('/sr/digitales-serviceheft/ is not built on balkan', async ({ request }) => {
		const res = await request.get('/sr/digitales-serviceheft/');
		expect(res.status()).not.toBe(200);
	});

	test('sitemap includes GEO intent URL', async ({ request }) => {
		const res = await request.get('/sitemap.xml');
		expect(res.status()).toBe(200);
		const locs = sitemapLocUrls(await res.text());
		expect(locs).toContain(`${SK_ORIGIN}/sr/digitalna-servisna-knjizica/`);
	});
});
