import { useRef } from 'react'

const EMPTY_VALUE = Symbol('empty-value')

/**
 * Resolves a value or a function that creates the value into a singleton instance.
 *
 * @template T - The type of the value to be resolved.
 * @param value - The value or function that creates the value.
 * @returns The resolved singleton instance of the value.
 */
const resolve = <T = undefined>(value: T | (() => T)) => {
  if (typeof value === 'function') {
    return (value as Function)() as T;
  } else {
    return value;
  }
};

/**
 * Returns a singleton instance of a given value or a function that creates the value.
 *
 * @template T - The type of the value to be returned.
 * @param value - The value or function that creates the value.
 * @returns The singleton instance of the value.
 */
export const useSingleton = <T = undefined>(value: T | (() => T)): T => {
  const resultRef = useRef<T | typeof EMPTY_VALUE>(EMPTY_VALUE);
  if (resultRef.current === EMPTY_VALUE) {
    resultRef.current = resolve(value);
  }
  return resultRef.current;
}

export default useSingleton
