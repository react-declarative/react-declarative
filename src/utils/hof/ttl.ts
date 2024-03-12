import memoize, { IClearable as IClearableInternal, IRef, GET_VALUE_MAP } from './memoize';

const DEFAULT_TIMEOUT = 250;
const NEVER_VALUE = Symbol('never');

export interface IClearable<K = string> extends IClearableInternal<K> {
    gc: () => void;
}

/**
 * Wrap a function with time-to-live (TTL) caching.
 *
 * @template T - The function type.
 * @template A - The argument types of the function.
 * @template K - The key type for caching.
 * @param run - The function to wrap.
 * @param options - The configuration options.
 * @param [options.key] - The key generator function that generates a key based on function arguments.
 * @param [options.timeout] - The TTL duration in milliseconds.
 * @returns - The wrapped function with caching capability.
 */
export const ttl = <T extends (...args: A) => any, A extends any[], K = string>(run: T, {
    key = () => NEVER_VALUE as never,
    timeout = DEFAULT_TIMEOUT,
}: {
    key?: (args: A) => K;
    timeout?: number;
} = {}): T & IClearable<K> => {

    const wrappedFn = memoize(key, (...args) => ({
        value: run(...args),
        ttl: Date.now(),
    }));

    const executeFn = (...args: A): ReturnType<T> => {
        const currentTtl = Date.now();
        const { value, ttl } = wrappedFn(...args);
        if (currentTtl - ttl > timeout) {
            const k = key(args);
            wrappedFn.clear(k);
            return executeFn(...args);
        }
        return value;
    };

    executeFn.clear = (key?: K) => {
        wrappedFn.clear(key);
    };

    executeFn.gc = () => {
        const valueMap: Map<K, IRef<{ ttl: number }>> = wrappedFn[GET_VALUE_MAP]();
        for (const [key, item] of valueMap.entries()) {
            const currentTtl = Date.now();
            if (currentTtl - item.current.ttl > timeout) {
                wrappedFn.clear(key);
            }
        }
    };

    return executeFn as T & IClearable<K>;
};

export default ttl;
