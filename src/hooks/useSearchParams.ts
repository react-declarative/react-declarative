import { useMemo } from 'react';

import useSingleton from './useSingleton';

import set from '../utils/set';

export type Value = string | number | boolean | null | undefined;

/**
 * Returns an object representing the parsed search parameters from the current URL.
 * The object will have the specified default values, which can be a partial object or a function that returns a partial object.
 * The returned object will have the same properties as the default values, with values parsed from the URL search parameters.
 *
 * @template T - The type of the default values object.
 * @param [defaultValues={}] - The default values object or function. Defaults to an empty object.
 * @returns - The parsed search parameters object.
 */
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
                if (value && !isNaN(value as unknown as number)) {
                    set(result, key, parseInt(value));
                } else {
                    set(result, key, value);
                }
            }
        });
        return result as T;
    }, [initialValues]);
};

export default useSearchParams;
