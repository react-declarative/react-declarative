/**
 * Manages the ability to abort operations using the AbortController API.
 *
 * @class
 */
export const abortManager = new class {
    
    _lastInstance?: AbortController;
    
    get signal() {
        return this._lastInstance?.signal;
    };

    constructor() {
        if ('AbortController' in window) {
            this._lastInstance = new AbortController();
        }
    }

    /**
     * Aborts the last instance of AbortController if available.
     * Creates a new instance of AbortController.
     *
     * @function abort
     * @memberof global
     *
     * @example
     * abort();
     */
    abort = () => {
        if ('AbortController' in window) {
            this._lastInstance?.abort();
            this._lastInstance = new AbortController();
        }
    };

};

export default abortManager;
