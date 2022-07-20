import { createBrowserHistory, createMemoryHistory } from "history";

export const createWindowHistory = () => {
    if (window.location.protocol === 'file:') {
        return createMemoryHistory();
    } else {
        return createBrowserHistory();
    }
};

export default createWindowHistory;
