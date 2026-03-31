/** Legacy legal strings use `:privacy_url` placeholders (Laravel route injection). */
export function replacePrivacyUrl(html: string, privacyUrl: string): string {
	return html.replaceAll(':privacy_url', privacyUrl);
}
