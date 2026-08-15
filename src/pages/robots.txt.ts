import type { APIRoute } from 'astro';
import { buildRobotsTxt } from '../config/crawlArtifacts';

export const prerender = true;

export const GET: APIRoute = () => {
	const siteUrl =
		(typeof import.meta.env.PUBLIC_SITE_URL === 'string' && import.meta.env.PUBLIC_SITE_URL.length > 0
			? import.meta.env.PUBLIC_SITE_URL
			: 'https://www.servisna-knjizica.com');

	return new Response(buildRobotsTxt(siteUrl), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
