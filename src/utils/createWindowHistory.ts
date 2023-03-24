import { BrowserHistory, createBrowserHistory, createMemoryHistory, MemoryHistory } from "history";

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
