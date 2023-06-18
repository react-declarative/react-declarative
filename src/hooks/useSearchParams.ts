import { useMemo } from 'react';

import useSingleton from './useSingleton';

import set from '../utils/set';

export type Value = string | number | boolean | null | undefined;

export const useSearchParams = <T = Record<string, Value>>(
    defaultValues: Partial<T> | (() => Partial<T>) = {}
): T => {
    const initialValues = useSingleton(defaultValues);
    return useMemo(() => {
        const url = new URL(window.location.href, window.location.origin);
        const result: Partial<T> = { ...initialValues };
        url.searchParams.forEach((value, key) => {
            if (value === "true") {
                set(result, key, true);
            } else if (value === "false") {
                set(result, key, false);
            } else if (value === "null") {
                set(result, key, null);
            } else {
                const numberValue = parseFloat(value);
                if ((!Number.isNaN(numberValue))) {
                    set(result, key, parseFloat(value));
                } else {
                    set(result, key, value);
                }
            }
        });
        return result as T;
    }, [initialValues]);
};

export default useSearchParams;
