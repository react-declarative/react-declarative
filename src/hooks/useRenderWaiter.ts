import { useRef, useEffect, useCallback } from "react";

import useSubject from "./useSubject";

/**
 * Creates a render waiter hook.
 *
 * @param [deps] - Optional array of dependencies. When the dependencies change, the render waiter will trigger a re-render.
 * @param [delay=0] - Optional delay in milliseconds before triggering the render waiter.
 * @returns - Render waiter function that returns a promise that resolves when the render is complete.
 */
export const useRenderWaiter = (deps?: any[], delay = 0) => {
  const initialChange = useRef(true);
  const subject = useSubject<void>();
  useEffect(() => {
    if (initialChange.current) {
      initialChange.current = false;
      return;
    }
    if (delay) {
      setTimeout(subject.next, delay);
      return;
    }
    subject.next();
  }, deps);
  useEffect(() => () => {
    subject.next();
  }, []);
  return useCallback(() => new Promise<void>((res) => subject.once(() => res())), []);
};

export default useRenderWaiter;
