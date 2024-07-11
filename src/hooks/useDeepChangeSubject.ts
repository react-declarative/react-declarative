import { useEffect, useRef } from "react";

import useSubject from "./useSubject";
import useDebounce from "../components/One/hooks/useDebounce";

import deepCompare from "../utils/deepCompare";

const DEBOUNCE_TIMEOUT = 800;

export const useDeepChangeSubject = <T extends object = any>(object: T) => {
    const [objectD] = useDebounce(object, DEBOUNCE_TIMEOUT)
    const prevObject = useRef(object);
    const resultSubject = useSubject<T>();
    const initialChange = useRef(true);
    useEffect(() => {
        if (initialChange.current) {
            initialChange.current = false;
            return;
        }
        if (!deepCompare(objectD, prevObject.current)) {
            prevObject.current = objectD;
            resultSubject.next(objectD);
        }
    }, [objectD]);
    return resultSubject;
};

export default useDeepChangeSubject;
