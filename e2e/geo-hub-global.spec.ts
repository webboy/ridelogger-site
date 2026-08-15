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

test.describe('GEO hub + intent (global)', () => {
	test('/de/ home has definition in SSR HTML', async ({ request }) => {
		const res = await request.get('/de/');
		expect(res.status()).toBe(200);
		const html = await res.text();
		expect(html).toContain('data-hk="hero.definition"');
		expect(html).toContain('digitales Serviceheft');
		expect(html).toContain('Servisna Knjižica');
	});

	test('/de/digitales-serviceheft/ 200 with hreflang trio and CTA', async ({ request }) => {
		const res = await request.get('/de/digitales-serviceheft/');
		expect(res.status()).toBe(200);
		const html = await res.text();
		expect(html).toContain('<h1');
		expect(html).toContain('digitales Serviceheft');
		const links = hreflangLinks(html);
		expect(
			links.some(
				(l) =>
					l.hreflang === 'sr-Latn' &&
					l.href === `${SK_ORIGIN}/sr/digitalna-servisna-knjizica/`,
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
		expect(html).toContain('app.ridelogger.com');
		expect(html).toContain('data-app-link');
	});

	test('/us/digital-service-logbook/ is English', async ({ request }) => {
		const res = await request.get('/us/digital-service-logbook/');
		expect(res.status()).toBe(200);
		const html = await res.text();
		expect(html).toMatch(/<html lang="en"/);
		expect(html).toContain('digital service logbook');
		expect(html).toContain('Servisna Knjižica');
	});

	test('/de/digitalna-servisna-knjizica/ is not built on global', async ({ request }) => {
		const res = await request.get('/de/digitalna-servisna-knjizica/');
		expect(res.status()).not.toBe(200);
	});

	test('sitemap includes GEO intent URLs', async ({ request }) => {
		const res = await request.get('/sitemap.xml');
		expect(res.status()).toBe(200);
		const locs = sitemapLocUrls(await res.text());
		expect(locs).toContain(`${RL_ORIGIN}/de/digitales-serviceheft/`);
		expect(locs).toContain(`${RL_ORIGIN}/us/digital-service-logbook/`);
	});
});
