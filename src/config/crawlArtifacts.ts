import type { DeployInstance } from './countries';
import { countryPagesForInstance } from './countries';
import { hreflangAlternates } from './hreflang';
import {
	absolutePageUrl,
	countryEmitsCampaigns,
	sitePagesForInstance,
} from './siteRoutes';

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export function buildRobotsTxt(siteUrl: string): string {
	const sitemap = new URL('sitemap.xml', siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`).href;
	return [
		'User-agent: Googlebot',
		'Allow: /',
		'User-agent: OAI-SearchBot',
		'Allow: /',
		'User-agent: PerplexityBot',
		'Allow: /',
		'User-agent: GPTBot',
		'Allow: /',
		'User-agent: *',
		'Allow: /',
		`Sitemap: ${sitemap}`,
		'',
	].join('\n');
}

export function buildSitemapXml(instance: DeployInstance, siteUrl: string): string {
	const origin = siteUrl.replace(/\/$/, '');
	const pages = sitePagesForInstance(instance);
	const lines: string[] = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
	];

	for (const page of pages) {
		const loc = absolutePageUrl(origin, page.countryPath, page.pathSuffix);
		const alternates = hreflangAlternates({
			countryPath: page.countryPath,
			pathSuffix: page.pathSuffix,
		});

		lines.push('  <url>');
		lines.push(`    <loc>${escapeXml(loc)}</loc>`);
		for (const alt of alternates) {
			lines.push(
				`    <xhtml:link rel="alternate" hreflang="${escapeXml(alt.hreflang)}" href="${escapeXml(alt.href)}" />`,
			);
		}
		lines.push('  </url>');
	}

	lines.push('</urlset>');
	return `${lines.join('\n')}\n`;
}

export function buildLlmsTxt(instance: DeployInstance, siteUrl: string): string {
	const origin = siteUrl.replace(/\/$/, '');
	const brand = instance === 'balkan' ? 'Servisna Knjižica' : 'RideLogger';
	const pages = sitePagesForInstance(instance);
	const urls = pages.map((p) => absolutePageUrl(origin, p.countryPath, p.pathSuffix));

	return [
		`# ${brand} marketing site`,
		`# Instance: ${instance}`,
		`# Canonical origin: ${origin}`,
		'',
		'## Public pages',
		...urls.map((u) => `- ${u}`),
		'',
		'## Related product',
		instance === 'balkan'
			? '- https://www.ridelogger.com/ (RideLogger — global)'
			: '- https://www.servisna-knjizica.com/ (Servisna Knjižica — Balkan)',
		'',
	].join('\n');
}

/** Country path segments for global campaign getStaticPaths (excludes US). */
export function globalCampaignCountryPaths(): string[] {
	return countryPagesForInstance('global')
		.filter((c) => countryEmitsCampaigns(c.path))
		.map((c) => c.path);
}
