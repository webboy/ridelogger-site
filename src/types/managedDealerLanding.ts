export type ManagedDealerLandingContent = {
	meta: {
		title: string;
		description: string;
		heroImageAlt: string;
	};
	hero: {
		eyebrow: string;
		headline: string;
		sub: string;
		primaryCta: string;
		secondaryCta: string;
		/** Typically parent DIY dealer landing: `../` */
		secondaryHref: string;
	};
	trustStrip: string[];
	intro: { headline: string; body: string };
	problem: { headline: string; body: string };
	beforeSale: { headline: string; items: string[] };
	afterSale: { headline: string; items: string[] };
	pricing: {
		headline: string;
		priceLine: string;
		body: string;
		footnote: string;
	};
	privacy: { headline: string; body: string };
	faq: { items: { q: string; a: string }[] };
	closing: {
		headline: string;
		body: string;
		diyCta: string;
		diyHref: string;
	};
	sectionLabels?: {
		trustStripHeading: string;
		faqHeading: string;
	};
};
