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

    abort = () => {
        if ('AbortController' in window) {
            this._lastInstance?.abort();
            this._lastInstance = new AbortController();
        }
    };

};

export default abortManager;
