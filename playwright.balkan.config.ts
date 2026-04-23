import { defineConfig, devices } from '@playwright/test';

/**
 * SK (balkan) build — tests `/sr/prodaja-auta/` and `/sr/auto-placevi/`.
 */
export default defineConfig({
	testDir: './e2e',
	testMatch: 'balkan-landings.spec.ts',
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'list',
	use: {
		...devices['Desktop Chrome'],
		baseURL: 'http://127.0.0.1:4173',
	},
	webServer: {
		command:
			'PUBLIC_INSTANCE=balkan PUBLIC_SITE_URL=https://www.servisna-knjizica.com PUBLIC_APP_URL=https://app.servisna-knjizica.com astro build && astro preview --port 4173 --host 127.0.0.1',
		url: 'http://127.0.0.1:4173',
		reuseExistingServer: !process.env.CI,
		timeout: 180_000,
		stdout: 'pipe',
		stderr: 'pipe',
	},
});
