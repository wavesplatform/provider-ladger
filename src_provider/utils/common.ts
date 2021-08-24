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
