import { useRef, useEffect, useCallback } from "react";

import useSubject from "./useSubject";

export const useRenderWaiter = (deps?: any[]) => {
    const initialChange = useRef(true);
    const subject = useSubject<void>();
    useEffect(() => {
        if (initialChange.current) {
          initialChange.current = false;
          return;
        }
        subject.next();
    }, deps);
    return useCallback(() => new Promise<void>((res) => subject.once(() => res())), []);
};

export default useRenderWaiter;
