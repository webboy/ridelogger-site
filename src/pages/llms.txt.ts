import type { APIRoute } from 'astro';
import type { DeployInstance } from '../config/countries';
import { buildLlmsTxt } from '../config/crawlArtifacts';

export const prerender = true;

export const GET: APIRoute = () => {
	const instance = (import.meta.env.PUBLIC_INSTANCE || 'balkan') as DeployInstance;
	const siteUrl =
		(typeof import.meta.env.PUBLIC_SITE_URL === 'string' && import.meta.env.PUBLIC_SITE_URL.length > 0
			? import.meta.env.PUBLIC_SITE_URL
			: 'https://www.servisna-knjizica.com');

	return new Response(buildLlmsTxt(instance, siteUrl), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
