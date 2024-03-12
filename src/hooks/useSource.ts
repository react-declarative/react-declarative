import { useEffect, useMemo } from "react";

import TObserver from "../model/TObserver";

import useSingleton from "./useSingleton";

/**
 * Custom hook for using an observable data source.
 *
 * @template Data The type of data observed.
 * @param {TObserver<Data> | (() => TObserver<Data>)} target The observable data source or a function that returns the observable data source.
 * @returns {Observable<Data>} The shared observable data.
 */
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
