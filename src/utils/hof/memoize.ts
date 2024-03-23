export interface IClearable<K = string> {
    clear: (key?: K) => void;
}

export interface IRef<T = any> {
    current: T;
}

interface Function {
    (...args: any): any;
}

export const GET_VALUE_MAP = Symbol('get-value-map');

/**
 * A memoization function that caches the result of a function based on its arguments.
 *
 * @template T - The function type that will be memoized
 * @template A - The argument types of the function
 * @template K - The key type used to store the memoized results
 * @param key - A function that generates a unique key based on the arguments of the original function
 * @param run - The original function to be memoized
 * @returns - A memoized version of the original function with the ability to clear the cache
 */
export const memoize = <T extends (...args: A) => any, A extends any[], K = string>(key: (args: A) => K, run: T): T & IClearable<K> => {

    const valueMap = new Map<K, IRef<ReturnType<T>>>();

    /**
     * Clears the value map.
     * If a key is provided, it deletes the corresponding value from the map.
     * If no key is provided, it clears the entire map.
     *
     * @param [key] - The key of the value to delete from the map.
     * @returns
     */
    const clear = (key?: K) => {
        if (key) {
            valueMap.delete(key);
            return;
        }
        valueMap.clear();
    };

    /**
     * Executes a function with the given arguments and caches the result.
     * Implements the `IClearable` interface.
     *
     * @template A - The argument types of the function.
     * @template T - The return type of the function.
     * @param args - The arguments to pass to the function.
     * @returns - The cached result of the function.
     */
    const executeFn: Function & IClearable<any> = (...args: A) => {
        const k = key(args);
        let value = valueMap.get(k)?.current;
        if (value === undefined) {
            const ref = { current: undefined };
            valueMap.set(k, ref as unknown as IRef<ReturnType<T>>);
            value = ref.current = run(...args);
        }
        return value;
    };

    executeFn[GET_VALUE_MAP] = () => valueMap;

    executeFn.clear = clear;

    return executeFn as T & IClearable<K>;
};

export default memoize;
