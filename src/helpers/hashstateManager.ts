import { BrowserHistory, HashHistory, MemoryHistory } from 'history';

/**
 * HashstateManager Class
 *
 * @class
 * @classdesc A class that provides methods to get and set the hash value in the history object.
 *
 * @param history - The history object to work with.
 */
export const createHashstateManager = (history: MemoryHistory | BrowserHistory | HashHistory) => new class {

    /**
     * Retrieves the value of the current hash from the browser's location.
     *
     * @returns The value of the current hash.
     */
    getValue = () => {
        const { hash } = history.location;
        return hash[0] === '#' ? hash.slice(1, hash.length) : hash;
    };

    /**
     * Sets the hash value in the URL of the current page.
     *
     * @param hash - The new hash value to be set.
     * @returns
     */
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
