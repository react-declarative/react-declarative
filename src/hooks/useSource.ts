import { useEffect, useMemo } from "react";

import TObserver from "../model/TObserver";

import useSingleton from "./useSingleton";

export const useSource = <Data = any>(target: TObserver<Data> | (() => TObserver<Data>)) => {
    const value = useSingleton(target);
    useEffect(() => {
        let isDirty = true;
        isDirty = isDirty && typeof target !== 'function';
        isDirty = isDirty && value !== target;
        if (isDirty) {
            (target as TObserver<Data>).unsubscribe();
        }
    }, [target]);
    useEffect(() => () => {
        value.unsubscribe();
    }, []);
    return useMemo(() => value.share(), []);
};

export default useSource;
