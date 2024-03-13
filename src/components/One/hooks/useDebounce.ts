//@ts-nocheck

import { useCallback, useEffect, useState, useRef } from 'react';

import {
    useDebouncedCallback,
    DebouncedControlFunctions,
} from './useDebouncedCallback';

import { Value } from '../../../model/IField';

function valueEquality<T>(left: T, right: T): boolean {
    return left === right;
}

/**
 * Debounces the given value with the specified delay.
 *
 * @param value - The value to be debounced.
 * @param delay - The delay in milliseconds before invoking the debounced value.
 * @param options - The optional configuration options for debounce behavior.
 * @param options.maxWait - The maximum wait time in milliseconds before invoking the debounced value.
 * @param options.leading - Determines if the debounced value should be invoked on the leading edge.
 * @param options.trailing - Determines if the debounced value should be invoked on the trailing edge.
 * @param options.equalityFn - The custom equality function to compare previous and current values.
 * @returns An array containing the debounced value and control functions for the debounced callback.
 */
export function useDebounce<T extends Value>(
    value: T,
    delay: number,
    options?: { maxWait?: number; leading?: boolean; trailing?: boolean; equalityFn?: (left: T, right: T) => boolean }
): [T, DebouncedControlFunctions] {
    const eq = (options && options.equalityFn) || valueEquality;

    const [state, dispatch] = useState(value);
    const debounced = useDebouncedCallback(useCallback((value: T) => dispatch(value), []), delay, options);
    const previousValue = useRef(value);

    useEffect(() => {
        // We need to use this condition otherwise we will run debounce timer for the
        // first render (including maxWait option)
        if (!eq(previousValue.current, value)) {
            debounced.callback(value);
            previousValue.current = value;
        }
    }, [value, debounced, eq]);

    return [state, { cancel: debounced.cancel, pending: debounced.pending, flush: debounced.flush }];
}

export default useDebounce;
