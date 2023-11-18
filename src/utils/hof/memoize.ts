interface IClearable<K = string> {
    clear: (key?: K) => void;
}

export const memoize = <T extends (...args: A) => V | Promise<V>, A extends any[], V extends any, K = string>(key: (args: A) => K, run: T): T & IClearable<K> => {

    const valueMap = new Map<K, V | Promise<V>>();

    const clear = (key?: K) => {
        if (key) {
            valueMap.delete(key);
            return;
        }
        valueMap.clear();
    };

    const executeFn = (...args: A) => {
        const k = key(args);
        let value = valueMap.get(k);
        if (value === undefined) {
            value = run(...args);
            valueMap.set(k, value);
        }
        return value;
    };

    executeFn.clear = clear;

    return executeFn as T & IClearable<K>;
};

export default memoize;
