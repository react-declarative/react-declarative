import { useRef, useCallback } from "react";

export const useActualCallback = <T extends (...args: any[]) => any>(run: T, deps: any[] = []): T => {
  const executeRef = useRef<T>(run);
  executeRef.current = run;
  return useCallback(((...args: any[]) => executeRef.current(...args)) as T, deps);
};

export default useActualCallback;
