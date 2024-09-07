/**
 * Interface representing a clearable object.
 * @template K - The type of the key.
 */
export interface IClearable<K = string> {
    clear: (key?: K) => void;
}

/**
 * Represents a reference to a value of type T.
 *
 * @template T - The type of the value referenced by this reference.
 */
export interface IRef<T = any> {
    current: T;
}

/**
 * Represents a generic control interface with key-value pair operations.
 * @template K The type of keys.
 * @template V The type of values.
 * @interface
 */
export interface IControl<K, V> {
    /**
     * Adds a key-value pair to the control.
     * @param key The key to add.
     * @param value The value to associate with the key.
     */
    add: (key: K, value: V) => void;

    /**
     * Removes a key and its associated value from the control.
     * @param key The key to remove.
     * @returns true if ok
     */
    remove: (key: K) => boolean;
}

/**
 * Represents a function that can take any number of arguments and return any value.
 * @typedef Function
 * @param  {...any} args - The arguments to be passed to the function.
 * @return {any} The result of the function execution.
 */
interface Function {
    (...args: any): any;
}

/**
 * Defines the GET_VALUE_MAP constant.
 *
 * This symbol is used to uniquely identify the 'get-value-map' property in an object or map.
 * It can be used as a key to retrieve or set a value from a map.
 *
 * @const {symbol} GET_VALUE_MAP - The symbol representing the 'get-value-map' property.
 */
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
export const memoize = <T extends (...args: A) => any, A extends any[], K = string>(key: (args: A) => K, run: T): T & IClearable<K> & IControl<K, ReturnType<T>> => {

    /**
     * A map that associates keys of type K with values of type IRef<ReturnType<T>>.
     *
     * @template K - The type of the keys in the valueMap.
     * @template T - The type of the values in the valueMap.
     */
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
    const executeFn: Function & IClearable<any> & IControl<K, ReturnType<T>> = (...args: A) => {
        const k = key(args);
        let value = valueMap.get(k)?.current;
        if (value === undefined) {
            const ref = { current: undefined };
            valueMap.set(k, ref as unknown as IRef<ReturnType<T>>);
            value = ref.current = run(...args);
        }
        return value;
    };

    /**
     * Executes the GET_VALUE_MAP function by symbol. Works like a friend classes in C++
     *
     * @return The value map containing key-value pairs.
     */
    // @ts-ignore
    executeFn[GET_VALUE_MAP] = () => valueMap;

    /**
     * Clears the executeFn function.
     *
     * @function clear
     * @memberof executeFn
     * @returns
     */
    executeFn.clear = clear;

    executeFn.add = (key: K, value: ReturnType<T>) => {
        let ref = valueMap.get(key);
        if (ref === undefined) {
            ref = { current: value };
        } else {
            ref.current = value;
        }
        valueMap.set(key, ref as unknown as IRef<ReturnType<T>>);
    };

    executeFn.remove = (key: K) => {
        return valueMap.delete(key);
    };

    return executeFn as T & IClearable<K> & IControl<K, ReturnType<T>>;
};

export default memoize;
