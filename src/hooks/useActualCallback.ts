import { useRef, useCallback } from "react";

/**
 * Executes a given callback function while preserving its reference and memoizing it with specified dependencies.
 *
 * @template T - Type of the callback function
 * @param {T} run - The callback function to be executed
 * @param {Array<any>} [deps=[]] - The dependencies to be memoized
 * @returns {T} - The memoized callback function
 */
export const useActualCallback = <T extends (...args: any[]) => any>(run: T, deps: any[] = []): T => {
  const executeRef = useRef<T>(run);
  executeRef.current = run;
  return useCallback(((...args: any[]) => executeRef.current(...args)) as T, deps);
};

export default useActualCallback;
