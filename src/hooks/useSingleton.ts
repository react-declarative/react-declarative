import { useRef, useCallback } from 'react'

const EMPTY_VALUE = Symbol('empty-value')

export const useSingleton = <T = undefined>(value: T | (() => T)): T => {
  const resolve = useCallback(() => {
    if (typeof value === 'function') {
      return (value as Function)() as T;
    } else {
      return value;
    }
  }, [])
  const resultRef = useRef<T | typeof EMPTY_VALUE>(EMPTY_VALUE);
  if (resultRef.current === EMPTY_VALUE) {
    resultRef.current = resolve();
  }
  return resultRef.current;
}

export default useSingleton
