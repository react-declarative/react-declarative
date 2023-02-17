import { useEffect, useState } from 'react';

import useSearchParams, { Value } from './useSearchParams';

export const useSearchState = <T extends Record<string, Value>>(defaultValues: Partial<T> | (() => Partial<T>) = {}) => {
    const initialValue = useSearchParams(defaultValues);
    const [state, setState] = useState(initialValue);
    useEffect(() => {
        const url = new URL(window.location.pathname, window.location.origin);
        Object.entries(state).forEach(([key, value]) => {
            url.searchParams.set(key, String(value));
        });
        window.history.pushState(null, '', url.toString());
    }, [state]);
    return [
        state,
        setState,
    ] as const;
};

export default useSearchState;
