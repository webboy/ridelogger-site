/** Shared Playwright paths — Docker E2E uses /tmp to avoid bind-mount permission issues. */
export const useDockerTmpOutput = process.env.PLAYWRIGHT_E2E_TMP_OUTPUT === '1';

export const playwrightOutputDir = useDockerTmpOutput
	? '/tmp/ridelogger-site-playwright-output/test-results'
	: 'test-results';

export const playwrightHtmlReportDir = useDockerTmpOutput
	? '/tmp/ridelogger-site-playwright-output/playwright-report'
	: 'playwright-report';
