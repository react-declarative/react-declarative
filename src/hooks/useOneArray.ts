import { useMemo, useState } from 'react';

import isObject from '../utils/isObject';

/**
 * Hook that manages an array of data.
 *
 * @template T - The type of elements in the array
 * @param {T[] | null | (() => T[])} [initialValue] - Optional initial value for the array
 * @returns {[T[], React.Dispatch<React.SetStateAction<T[] | null>>]} - A tuple containing the managed array and a function to update it
 */
export const useOneArray = <T = any>(initialValue?: ((T[] | null) | (() => T[]))) => {
    const [data, setData] = useState<T[] | null>(() => {
        let result = initialValue;
        if (typeof initialValue === 'function') {
            result = initialValue();
        }
        return Object.values(result || {});
    });
    const managedData = useMemo(() => {
        return Object.values(data || {});
    }, [data]);
    return [managedData, setData] as const;
};

export const oneArrayIncludes = <T = any>(data: T[] | null, ...items: T[]) => {
    if (typeof data === 'string') {
        data = [data];
    }
    items = items
        .map((item) => {
            if (typeof item === 'string') {
                return item;
            }
            return Object.values(item || {});
        })
        .flatMap((item) => item as unknown as T);
    return Object.values(data || {}).some((value) => items.includes(value));
};

export const isOneArray = <T = any>(data: T[]) => {
    if (Array.isArray(data)) {
        return true;
    } else if (isObject(data) && !Object.keys(data)?.length) {
        return true;
    } else if (data === null) {
        return true;
    } else {
        return false;
    }
};

export const toOneArray = <T = any>(data: T[]) => {
    if (Array.isArray(data)) {
        return data;
    } else if (isObject(data)) {
        const values = Object.values(data);
        if (!values.length) {
            return null;
        }
        return values;
    } else {
        return null;
    }
};

export default useOneArray;
