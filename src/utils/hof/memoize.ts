interface IClearable<K = string> {
    clear: (key?: K) => void;
}

export const memoize = <T extends (...args: A) => any, A extends any[], K = string>(key: (args: A) => K, run: T): T & IClearable<K> => {

    const valueMap = new Map<K, ReturnType<T>>();

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
            const result = run(...args);
            valueMap.set(k, result);
            value = result;
        }
        return value;
    };

    executeFn.clear = clear;

    return executeFn as T & IClearable<K>;
};

export default memoize;
