// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
// Set at build time, e.g. PUBLIC_SITE_URL=https://www.ridelogger.com PUBLIC_INSTANCE=global
const site =
	(typeof process.env.PUBLIC_SITE_URL === 'string' && process.env.PUBLIC_SITE_URL.length > 0
		? process.env.PUBLIC_SITE_URL
		: 'https://www.servisna-knjizica.com');

export default defineConfig({
	site,
	trailingSlash: 'always',
});
