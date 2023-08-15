import { useMemo, useState } from 'react';

import isObject from '../utils/isObject';

export const useOneArray = <T = any>(initialValue?: (T[] | (() => T[]))) => {
    const [data, setData] = useState<T[]>(() => {
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

export const oneArrayIncludes = <T = any>(data: T[], ...items: T[]) => {
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
