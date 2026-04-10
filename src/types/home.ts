export interface HomeMessages {
	meta: {
		title: string;
		description: string;
	};
	nav: {
		home: string;
		openApp: string;
		privacy: string;
		cookies: string;
	};
	hero: {
		eyebrow: string;
		headline: string;
		sub: string;
		primaryCta: string;
		secondaryCta: string;
		placeholderTitle: string;
		placeholderBody: string;
		/** Alt text for hero marketing illustration */
		imageAlt: string;
	};
	trust: {
		title: string;
		items: { title: string; detail: string }[];
	};
	problem: {
		title: string;
		problemTitle: string;
		problemBody: string;
		solutionTitle: string;
		solutionBody: string;
		imageAlt: string;
	};
	how: {
		title: string;
		/** Short line under the section heading */
		lead: string;
		steps: { title: string; body: string; tip: string }[];
	};
	features: {
		title: string;
		items: { title: string; body: string }[];
	};
	showcase: {
		title: string;
		body: string;
		wideAlt: string;
		narrowAlt: string;
	};
	security: {
		title: string;
		body: string;
		imageAlt: string;
	};
	testimonials: {
		title: string;
		items: { quote: string; author: string }[];
	};
	cta: {
		title: string;
		body: string;
		button: string;
	};
	/** Root landing page (`/`) — hero line under logo */
	landing: {
		heroLine: string;
	};
	footer: {
		tagline: string;
		note: string;
	};
}
