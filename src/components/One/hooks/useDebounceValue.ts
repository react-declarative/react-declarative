import { useEffect, useState, useMemo } from 'react';

import debounce from '../../../utils/hof/debounce';

import { Value } from '../../../model/IField';

export interface IDebouncedValueRef<T extends any = Value> {
    value: T;
}

type DispatchFn<T extends any = Value>  = (value: T) => void;

interface DispatchControls {
    clear: () => void;
    flush: () => void;
    pending: () => boolean;
}

/**
 * Debounces the given value with the specified delay.
 *
 * @param value - The value to be debounced.
 * @param delay - The delay in milliseconds before invoking the debounced value.
 * @returns An array containing the debounced value and control functions for the debounced callback.
 */
export function useDebounceValue<T extends any = Value>(
    value: T,
    delay: number,
): [IDebouncedValueRef<T>, DispatchFn<T>, DispatchControls] {
    const [state, setState] = useState<IDebouncedValueRef<T>>(() => ({ value }));
    const dispatch = useMemo(() => debounce((value: T) => setState({ value }), delay), []);
    useEffect(() => () => dispatch.clear(), []);
    return [state, dispatch, dispatch];
}

export default useDebounceValue;
