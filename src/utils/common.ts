import { detect } from 'detect-browser';

const unsupportedBrowsers = [
	'firefox'
];

export const isSupportedBrowser = (): boolean => {
	const browser = detect();

	if (browser == null || unsupportedBrowsers.includes(browser.name)) {
		return false
	} else {
		return true;
	}
};

export const sleep = (seconds: number): Promise<void> => {
	return new Promise((resolve, reject) => { setTimeout(resolve, seconds *1000); });
};

export const errorUserCancel = () => {
	return new Error('User rejection!')
}
