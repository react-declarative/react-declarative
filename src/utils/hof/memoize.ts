export interface IClearable<K = string> {
    clear: (key?: K) => void;
}

interface IRef<T = any> {
    current: T;
}

export const memoize = <T extends (...args: A) => any, A extends any[], K = string>(key: (args: A) => K, run: T): T & IClearable<K> => {

    const valueMap = new Map<K, IRef<ReturnType<T>>>();

    const clear = (key?: K) => {
        if (key) {
            valueMap.delete(key);
            return;
        }
        valueMap.clear();
    };

    const executeFn = (...args: A) => {
        const k = key(args);
        let value = valueMap.get(k)?.current;
        if (value === undefined) {
            const ref = { current: undefined };
            valueMap.set(k, ref as unknown as IRef<ReturnType<T>>);
            value = ref.current = run(...args);
        }
        return value;
    };

    executeFn.clear = clear;

    return executeFn as T & IClearable<K>;
};

export default memoize;
