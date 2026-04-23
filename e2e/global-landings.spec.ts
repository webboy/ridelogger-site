import { test, expect } from '@playwright/test';

test.describe('RL campaign landings (DE)', () => {
	test('private-sellers: title, app CTA, no Partner in header', async ({ page }) => {
		await page.goto('/de/private-sellers/');
		await expect(page).toHaveTitle(/RideLogger/);
		const app = page.locator('a[data-landing-cta="hero_primary"]').first();
		await expect(app).toHaveAttribute('href', /https:\/\/app\.ridelogger\.com/);
		await expect(app).toHaveAttribute('href', /lang=de/);
		await expect(page.locator('.site-header__cta a[href*="partner"]')).toHaveCount(0);
		await expect(page.locator('.site-header__tools .lang-switcher')).toHaveCount(1);
	});

	test('auto-dealers: title and app CTA', async ({ page }) => {
		await page.goto('/de/auto-dealers/');
		await expect(page).toHaveTitle(/RideLogger/);
		const app = page.locator('a[data-landing-cta="hero_primary"]').first();
		await expect(app).toHaveAttribute('href', /https:\/\/app\.ridelogger\.com/);
		await expect(app).toHaveAttribute('href', /lang=de/);
		await expect(page.locator('.site-header__cta a[href*="partner"]')).toHaveCount(0);
	});

	test('UTM params hydrate into app links', async ({ page }) => {
		await page.goto('/de/private-sellers/?utm_source=e2e&utm_medium=test');
		const app = page.locator('a[data-landing-cta="hero_primary"]').first();
		await expect(app).toHaveAttribute('href', /utm_source=e2e/);
		await expect(app).toHaveAttribute('href', /utm_medium=test/);
	});

	test('mobile viewport smoke', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto('/de/auto-dealers/');
		await expect(page.locator('h1')).toBeVisible();
	});

	test('private-sellers (FR): default locale in app link', async ({ page }) => {
		await page.goto('/fr/private-sellers/');
		await expect(page).toHaveTitle(/RideLogger/);
		const app = page.locator('a[data-landing-cta="hero_primary"]').first();
		await expect(app).toHaveAttribute('href', /lang=fr/);
	});
});
