import { BrowserHistory, createBrowserHistory, createMemoryHistory, MemoryHistory } from "history";

/**
 * Determines whether the application should use a memory history or a browser history based on the current environment.
 * @returns {MemoryHistory | BrowserHistory} - The appropriate history object based on the current environment.
 */
export const createWindowHistory = (): MemoryHistory | BrowserHistory => {
    if (!globalThis.location) {
        return createMemoryHistory();
    } else if (globalThis.location?.protocol === 'file:') {
        return createMemoryHistory();
    } else {
        return createBrowserHistory();
    }
};

export default createWindowHistory;
