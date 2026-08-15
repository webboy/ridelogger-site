import type { APIRoute } from 'astro';
import type { DeployInstance } from '../config/countries';
import { buildSitemapXml } from '../config/crawlArtifacts';

export const prerender = true;

export const GET: APIRoute = () => {
	const instance = (import.meta.env.PUBLIC_INSTANCE || 'balkan') as DeployInstance;
	const siteUrl =
		(typeof import.meta.env.PUBLIC_SITE_URL === 'string' && import.meta.env.PUBLIC_SITE_URL.length > 0
			? import.meta.env.PUBLIC_SITE_URL
			: 'https://www.servisna-knjizica.com');

	return new Response(buildSitemapXml(instance, siteUrl), {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' },
	});
};
