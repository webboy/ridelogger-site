import { test, expect } from '@playwright/test';

test.describe('SK campaign landings (SR)', () => {
	test('prodaja-auta: title, app CTA, no Partner in header', async ({ page }) => {
		await page.goto('/sr/prodaja-auta/');
		await expect(page).toHaveTitle(/Servisna knjižica/i);
		const app = page.locator('a[data-landing-cta="hero_primary"]').first();
		await expect(app).toHaveAttribute('href', /https:\/\/app\.servisna-knjizica\.com/);
		await expect(app).toHaveAttribute('href', /lang=sr-Latn/);
		await expect(page.locator('.site-header__cta a[href*="partner"]')).toHaveCount(0);
	});

	test('auto-placevi: title and app CTA', async ({ page }) => {
		await page.goto('/sr/auto-placevi/');
		await expect(page).toHaveTitle(/Servisna knjižica/i);
		const app = page.locator('a[data-landing-cta="hero_primary"]').first();
		await expect(app).toHaveAttribute('href', /https:\/\/app\.servisna-knjizica\.com/);
		await expect(app).toHaveAttribute('href', /lang=sr-Latn/);
	});

	test('UTM params hydrate into app links', async ({ page }) => {
		await page.goto('/sr/prodaja-auta/?utm_campaign=balkan-e2e');
		const app = page.locator('a[data-landing-cta="hero_primary"]').first();
		await expect(app).toHaveAttribute('href', /utm_campaign=balkan-e2e/);
	});

	test('mobile viewport smoke', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto('/sr/auto-placevi/');
		await expect(page.locator('h1')).toBeVisible();
	});

	test('prodaja-auta (MK): default locale in app link', async ({ page }) => {
		await page.goto('/mk/prodaja-auta/');
		await expect(page).toHaveTitle(/Сервисна книжица/);
		const app = page.locator('a[data-landing-cta="hero_primary"]').first();
		await expect(app).toHaveAttribute('href', /lang=mk/);
	});
});
