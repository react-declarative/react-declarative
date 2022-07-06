import { useEffect, useRef } from "react";

export const useActualCallback = <T extends (...args: any[]) => any>(run: T): T => {
    const executeRef = useRef<T>(run);
    useEffect(() => {
        executeRef.current = run;
    }, [run]);
    return ((...args: any[]) => executeRef.current(...args)) as T;
};

export default useActualCallback;
