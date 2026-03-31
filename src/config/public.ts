/** Web app entry URL (PWA); override with PUBLIC_APP_URL in `.env`. */
export function getAppUrl(): string {
	const v = import.meta.env.PUBLIC_APP_URL;
	return typeof v === 'string' && v.length > 0 ? v : 'https://app.servisna-knjizica.com';
}
