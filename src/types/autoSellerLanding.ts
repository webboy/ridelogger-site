export type AutoSellerLandingContent = {
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
		/** In-page anchor, e.g. `#how` or `#dealer-offer` */
		secondaryHref: string;
	};
	trustStrip: string[];
	intro: { headline: string; body: string };
	benefits: { headline: string; items: { title: string; body: string }[] };
	beforeAfter: {
		headline: string;
		beforeLabel: string;
		beforeBody: string;
		afterLabel: string;
		afterBody: string;
	} | null;
	inventoryAngle: { headline: string; body: string } | null;
	howItWorks: { headline: string; steps: { title: string; body: string }[] };
	objection: { headline: string; body: string } | null;
	offer: {
		eyebrow: string;
		headline: string;
		body: string;
		cta: string;
		footnote: string;
	} | null;
	faq: { items: { q: string; a: string }[] };
	closing: { headline: string; body: string; cta: string };
	/** Section headings not tied to CMS blocks (a11y / visible). */
	sectionLabels?: {
		trustStripHeading: string;
		faqHeading: string;
	};
};
