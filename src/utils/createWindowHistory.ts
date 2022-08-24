import { BrowserHistory, createBrowserHistory, createMemoryHistory, MemoryHistory } from "history";

export const createWindowHistory = (): MemoryHistory | BrowserHistory => {
    if (window.location.protocol === 'file:') {
        return createMemoryHistory();
    } else {
        return createBrowserHistory();
    }
};

export default createWindowHistory;
