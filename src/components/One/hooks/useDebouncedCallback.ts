// @ts-nocheck 

import { useRef, useMemo, useEffect, useCallback } from 'react';

/**
 * Represents the options for a class.
 */
export interface Options {
    maxWait?: number;
    leading?: boolean;
    trailing?: boolean;
}

/**
 * Interface for DebouncedControlFunctions.
 *
 * @interface
 */
export interface DebouncedControlFunctions {
    cancel: () => void;
    flush: () => void;
    pending: () => boolean;
}

type value = object | string | number | boolean;

/**
 * Subsequent calls to the debounced function `debounced.callback` return the result of the last func invocation.
 * Note, that if there are no previous invocations it's mean you will get undefined. You should check it in your
 * code properly.
 */
export interface DebouncedState<T extends (...args: value[]) => ReturnType<T>> extends DebouncedControlFunctions {
    callback: (...args: Parameters<T>) => ReturnType<T>;
}

/**
 * Returns a debounced version of the provided callback function.
 *
 * @template T - The type of the original callback function.
 * @param func - The original callback function.
 * @param [wait] - The debounce wait time in milliseconds (default: 0).
 * @param [options] - Additional options for debouncing (default: {}).
 * @returns - An object containing the debounced callback and utility functions.
 */
export function useDebouncedCallback<T extends (...args: value[]) => ReturnType<T>>(
    func: T,
    wait?: number,
    options?: Options
): DebouncedState<T> {
    const lastCallTime = useRef(null);
    const lastInvokeTime = useRef(0);
    const timerId = useRef(null);
    const lastArgs = useRef<unknown[]>([]);
    const lastThis = useRef();
    const result = useRef();
    const funcRef = useRef(func);
    const mounted = useRef(true);
    funcRef.current = func;

    // Bypass `requestAnimationFrame` by explicitly setting `wait=0`.
    const useRAF = !wait && wait !== 0 && typeof window !== 'undefined';

    if (typeof func !== 'function') {
        throw new TypeError('Expected a function');
    }

    wait = +wait || 0;
    options = options || {};

    const leading = !!options.leading;
    const trailing = 'trailing' in options ? !!options.trailing : true; // `true` by default
    const maxing = 'maxWait' in options;
    const maxWait = maxing ? Math.max(+options.maxWait || 0, wait) : null;

    /**
     * Invoke the provided function with the specified arguments and this context.
     *
     * @param time - The current time.
     * @returns - The result of invoking the function.
     */
    const invokeFunc = useCallback((time) => {
        const args = lastArgs.current;
        const thisArg = lastThis.current;

        lastArgs.current = lastThis.current = null;
        lastInvokeTime.current = time;
        return (result.current = funcRef.current.apply(thisArg, args));
    }, []);

    /**
     * A custom hook to start a timer with either requestAnimationFrame or setTimeout.
     *
     * @param pendingFunc - The function to be called when the timer triggers.
     * @param wait - The time in milliseconds to wait before triggering the function.
     * @returns
     */
    const startTimer = useCallback(
        (pendingFunc, wait) => {
            if (useRAF) cancelAnimationFrame(timerId.current);
            timerId.current = useRAF ? requestAnimationFrame(pendingFunc) : setTimeout(pendingFunc, wait);
        },
        [useRAF]
    );

    /**
     * Determines whether a function should be invoked based on the provided time.
     *
     * @param time - The current time in milliseconds.
     * @return {boolean} - True if the function should be invoked, false otherwise.
     */
    const shouldInvoke = useCallback(
        (time) => {
            if (!mounted.current) return false;

            const timeSinceLastCall = time - lastCallTime.current;
            const timeSinceLastInvoke = time - lastInvokeTime.current;

            // Either this is the first call, activity has stopped and we're at the
            // trailing edge, the system time has gone backwards and we're treating
            // it as the trailing edge, or we've hit the `maxWait` limit.
            return (
                !lastCallTime.current ||
                timeSinceLastCall >= wait ||
                timeSinceLastCall < 0 ||
                (maxing && timeSinceLastInvoke >= maxWait)
            );
        },
        [maxWait, maxing, wait]
    );

    /**
     * Executes the trailing edge of a debounced function.
     *
     * @param time - The timestamp of the trailing edge invocation.
     * @returns - The result of the debounced function's execution at the trailing edge.
     */
    const trailingEdge = useCallback(
        (time) => {
            timerId.current = null;

            // Only invoke if we have `lastArgs` which means `func` has been
            // debounced at least once.
            if (trailing && lastArgs.current) {
                return invokeFunc(time);
            }
            lastArgs.current = lastThis.current = null;
            return result.current;
        },
        [invokeFunc, trailing]
    );

    /**
     * Executes a callback function when the timer expires.
     *
     * @callback timerExpired
     * @returns
     */
    const timerExpired = useCallback(() => {

        if (!mounted.current) return;

        const time = Date.now();
        if (shouldInvoke(time)) {
            return trailingEdge(time);
        }

        // Remaining wait calculation
        const timeSinceLastCall = time - lastCallTime.current;
        const timeSinceLastInvoke = time - lastInvokeTime.current;
        const timeWaiting = wait - timeSinceLastCall;
        const remainingWait = maxing ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;

        // Restart the timer
        startTimer(timerExpired, remainingWait);
    }, [maxWait, maxing, shouldInvoke, startTimer, trailingEdge, wait]);

    /**
     * A function that cancels a timer or animation frame.
     * It resets various internal variables to their initial state.
     *
     * @param useRAF - A flag indicating whether to use requestAnimationFrame or clearTimeout.
     * @returns
     */
    const cancel = useCallback(() => {
        if (timerId.current) {
            useRAF ? cancelAnimationFrame(timerId.current) : clearTimeout(timerId.current);
        }
        lastInvokeTime.current = 0;
        lastArgs.current = lastCallTime.current = lastThis.current = timerId.current = null;
    }, [useRAF]);

    /**
     * Flushes the current value of a throttled function.
     *
     * @returns The current value of the throttled function if the timer is not set, otherwise the result of invoking `trailingEdge` function.
     *
     * @param trailingEdge - The function to be invoked after a delay when the timer is set.
     */
    const flush = useCallback(() => {
        return !timerId.current ? result.current : trailingEdge(Date.now());
    }, [trailingEdge]);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    /**
     * Invokes the provided function with debouncing logic.
     *
     * @param invokeFunc - The function to be debounced.
     * @param leading - Whether to invoke the function on the leading edge.
     * @param maxing - Whether to apply the `maxWait` logic.
     * @param shouldInvoke - A function that determines whether the debounced function should be invoked.
     * @param startTimer - A function that starts the debouncing timer.
     * @param timerExpired - A function that is called when the debouncing timer has expired.
     * @param wait - The delay in milliseconds before invoking the debounced function.
     *
     * @returns - The result of the debounced function.
     */
    const debounced = useCallback(
        (...args: Parameters<T>): ReturnType<T> => {

            if (!mounted.current) return result.current;

            const time = Date.now();
            const isInvoking = shouldInvoke(time);

            lastArgs.current = args;
            lastThis.current = this;
            lastCallTime.current = time;

            if (isInvoking) {
                if (!timerId.current && mounted.current) {
                    // Reset any `maxWait` timer.
                    lastInvokeTime.current = lastCallTime.current;
                    // Start the timer for the trailing edge.
                    startTimer(timerExpired, wait);
                    // Invoke the leading edge.
                    return leading ? invokeFunc(lastCallTime.current) : result.current;
                }
                if (maxing) {
                    // Handle invocations in a tight loop.
                    startTimer(timerExpired, wait);
                    return invokeFunc(lastCallTime.current);
                }
            }
            if (!timerId.current) {
                startTimer(timerExpired, wait);
            }
            return result.current;
        },
        [invokeFunc, leading, maxing, shouldInvoke, startTimer, timerExpired, wait]
    );

    /**
     * Returns whether there is a pending timer.
     *
     * @return {boolean} True if there is a pending timer, false otherwise.
     */
    const pending = useCallback(() => {
        return !!timerId.current;
    }, []);

    /**
     * Represents a debounced state that wraps the provided debounced function and related methods.
     *
     * @template T - The data type of the debounced state.
     */
    const debouncedState: DebouncedState<T> = useMemo(
        () => ({
            callback: debounced,
            cancel,
            flush,
            pending,
        }),
        [debounced, cancel, flush, pending]
    );

    return debouncedState;
}

export default useDebouncedCallback;
