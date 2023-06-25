import { useState } from 'react';

export const useOneArray = <T = any>(initialValue: (T[] | (() => T[]))) => {
    return useState<T[]>(() => {
        let result = initialValue;
        if (typeof initialValue === 'function') {
            result = initialValue();
        }
        return Object.values(result);
    });
};

export default useOneArray;
