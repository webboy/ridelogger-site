import { defineConfig, devices } from '@playwright/test';
import { playwrightHtmlReportDir, playwrightOutputDir } from './playwright.shared';

/**
 * RL (global) build — tests `/de/private-sellers/` and `/de/auto-dealers/`.
 */
export default defineConfig({
	testDir: './e2e',
	testMatch: 'global-landings.spec.ts',
	outputDir: playwrightOutputDir,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: [
		['list'],
		['html', { open: 'never', outputFolder: playwrightHtmlReportDir }],
	],
	use: {
		...devices['Desktop Chrome'],
		baseURL: 'http://127.0.0.1:4173',
	},
	webServer: {
		command:
			'PUBLIC_INSTANCE=global PUBLIC_SITE_URL=https://www.ridelogger.com PUBLIC_APP_URL=https://app.ridelogger.com PUBLIC_DEALER_BONUS_INQUIRY_URL="mailto:e2e-dealer@example.com?subject=E2E-Bonus" PUBLIC_MANAGED_DEALER_INQUIRY_URL="mailto:e2e-managed@example.com?subject=E2E-Managed" astro build && astro preview --port 4173 --host 127.0.0.1',
		url: 'http://127.0.0.1:4173',
		reuseExistingServer: !process.env.CI,
		timeout: 180_000,
		stdout: 'pipe',
		stderr: 'pipe',
	},
});
