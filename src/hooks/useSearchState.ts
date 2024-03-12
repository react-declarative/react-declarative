import { useEffect, useState } from 'react';

import useSearchParams, { Value } from './useSearchParams';

import isObject from '../utils/isObject';

/**
 * Custom hook useSearchState for managing search state in the URL.
 *
 * @template T - Type of the search state object.
 * @param defaultValues - Default values for the search state object.
 * @returns - An array containing the search state object and a function to update the search state.
 */
export const useSearchState = <T extends Record<string, Value>>(defaultValues: Partial<T> | (() => Partial<T>) = {}) => {
    const initialValue = useSearchParams(defaultValues);
    const [state, setState] = useState(initialValue);
    useEffect(() => {
        const url = new URL(window.location.pathname, window.location.origin);
        Object.entries(state).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                url.searchParams.set(key, JSON.stringify(value));
                return;
            }
            if (isObject(value)) {
                url.searchParams.set(key, JSON.stringify(value));
                return;
            }
            url.searchParams.set(key, String(value));
        });
        window.history.pushState(null, '', url.toString());
    }, [state]);
    useEffect(() => () => {
        const url = new URL(window.location.pathname, window.location.origin);
        url.searchParams.forEach((_, key) => url.searchParams.delete(key));
        window.history.pushState(null, '', url.toString());
    }, []);
    return [
        state,
        setState,
    ] as const;
};

export default useSearchState;
