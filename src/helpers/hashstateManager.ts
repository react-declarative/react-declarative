import { BrowserHistory, HashHistory, MemoryHistory } from 'history';

export const createHashstateManager = (history: MemoryHistory | BrowserHistory | HashHistory) => new class {

    getValue = () => {
        const { hash } = history.location;
        return hash[0] === '#' ? hash.slice(1, hash.length) : hash;
    };

    setValue = (hash: string) => {
        const { pathname, search } = history.location;
        history.push({
            pathname,
            search,
            hash,
        });
    };

};

export default createHashstateManager;
