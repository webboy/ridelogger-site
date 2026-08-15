export type GeoIntentLandingContent = {
	meta: {
		title: string;
		description: string;
		heroImageAlt: string;
	};
	hero: {
		eyebrow: string;
		headline: string;
		/** First paragraph — answers “what is this app”. */
		sub: string;
		primaryCta: string;
		secondaryCta: string;
		secondaryHref: string;
	};
	intro: { headline: string; body: string };
	benefits: { headline: string; items: { title: string; body: string }[] };
	howItWorks: { headline: string; steps: { title: string; body: string }[] };
	faq: { items: { q: string; a: string }[] };
	closing: { headline: string; body: string; cta: string };
	sectionLabels?: {
		faqHeading: string;
	};
};
