const createFlushAwaiter = (delay: number) => new Promise<void>((res) => {

    const resolve = () => {
        res();
        observer.disconnect();
        delayManager.clear();
    };

    const delayManager = new class {
        _delay?: NodeJS.Timeout;
        push = () => {
            this.clear();
            this._delay = setTimeout(() => {
                resolve();
            }, delay);
        };
        clear = () => {
            if (this._delay !== undefined) {
                clearTimeout(this._delay);
            }
            this._delay = undefined;
        };
    };

    const observer = new MutationObserver(() => {
        delayManager.push()
    });

    observer.observe(document.documentElement, {
        attributes: true,
        childList: true,
        subtree: true,
    });
});

const flushManager = new class {
    _lastFlushAwaiter?: Promise<void>;
    waitForFlush = (delay = 1_000) => {
        if (!this._lastFlushAwaiter) {
            this._lastFlushAwaiter = createFlushAwaiter(delay).then(() => {
                this._lastFlushAwaiter = undefined;
            });
        }
        return this._lastFlushAwaiter;
    };
};

export const waitForFlush = flushManager.waitForFlush;

export default waitForFlush;
