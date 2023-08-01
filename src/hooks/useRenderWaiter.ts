import { useRef, useEffect, useCallback } from "react";

import useSubject from "./useSubject";

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
