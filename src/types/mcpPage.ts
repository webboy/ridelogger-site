export type McpToolGroup = {
	title: string;
	body: string;
	tools: string[];
};

export type McpExample = {
	title: string;
	prompt: string;
};

export type McpPageMessages = {
	meta: {
		title: string;
		description: string;
	};
	hero: {
		eyebrow: string;
		title: string;
		lead: string;
		primaryCta: string;
		secondaryCta: string;
	};
	connection: {
		title: string;
		body: string;
		endpointLabel: string;
		transportLabel: string;
		transportValue: string;
		authLabel: string;
		authValue: string;
	};
	tools: {
		title: string;
		intro: string;
		groups: McpToolGroup[];
	};
	safety: {
		title: string;
		items: string[];
	};
	examples: {
		title: string;
		items: McpExample[];
	};
};
