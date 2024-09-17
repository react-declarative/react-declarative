//@ts-nocheck

import { useCallback, useEffect, useState, useRef } from 'react';

import {
    useDebouncedCallback,
    DebouncedControlFunctions,
} from './useDebouncedCallback';

import { Value } from '../../../model/IField';

/**
 * Determines whether two values are equal.
 *
 * @template T - The type of the values being compared.
 *
 * @param left - The first value to compare.
 * @param right - The second value to compare.
 *
 * @return - Returns true if the values are equal, otherwise returns false.
 */
function valueEquality<T>(left: T, right: T): boolean {
    return left === right;
}

export interface IDebouncedValueRef<T extends any = Value> {
    value: T;
}

type DispatchFn<T extends any = Value>  = (value: T) => void;

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
export function useDebounceValue<T extends any = Value>(
    value: T,
    delay: number,
    options?: { maxWait?: number; leading?: boolean; trailing?: boolean; equalityFn?: (left: T, right: T) => boolean }
): [IDebouncedValueRef<T>, DispatchFn<T>, DebouncedControlFunctions] {
    const eq = (options && options.equalityFn) || valueEquality;

    const [state, setState] = useState<IDebouncedValueRef<T>>(() => ({ value }));
    const debounced = useDebouncedCallback(useCallback((value: T) => setState({ value }), []), delay, options);
    const previousValue = useRef(value);

    const dispatch = useCallback((value: T) => {
        // We need to use this condition otherwise we will run debounce timer for the
        // first render (including maxWait option)
        if (!eq(previousValue.current, value)) {
            debounced.callback(value);
            previousValue.current = value;
        }
    }, [value, debounced, eq]);

    return [state, dispatch, { cancel: debounced.cancel, pending: debounced.pending, flush: debounced.flush }];
}

export default useDebounceValue;
