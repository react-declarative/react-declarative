import { useState } from 'react';

import isObject from '../utils/isObject';

export const useOneArray = <T = any>(initialValue?: (T[] | (() => T[]))) => {
    return useState<T[]>(() => {
        let result = initialValue;
        if (typeof initialValue === 'function') {
            result = initialValue();
        }
        return Object.values(result || {});
    });
};

export const oneArrayIncludes = <T = any>(data: T[], item: T) => {
    return Object.values(data || {}).includes(item);
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

export default useOneArray;
