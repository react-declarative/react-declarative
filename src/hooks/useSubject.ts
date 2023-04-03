import { useEffect } from "react";

import Subject, { TSubject } from "../utils/rx/Subject";
import TObserver from "../model/TObserver";

import useSingleton from "./useSingleton";

type Target<Data = any> = TSubject<Data> | TObserver<Data> | null;

export const useSubject = <Data = any>(target?: Target<Data> | (() => Target<Data>)) => {
    const result = useSingleton(() => new Subject<Data>());
    const value = useSingleton(target);
    useEffect(() => {
        let isDirty = true;
        isDirty = isDirty && typeof target !== 'function';
        isDirty = isDirty && value !== target;
        isDirty = isDirty && target ? ('connect' in target) : false;
        if (isDirty) {
            target && (target as TObserver<Data>).unsubscribe();
        }
    }, [target]);
    useEffect(() => {
        let dtor: any = undefined;
        if (value) {
            if ('subscribe' in value) {
                dtor = value.subscribe(result.next);
            }
            if ('connect' in value) {
                dtor = value.connect(result.next);
            }
        }
        return dtor;
    }, []);
    return result;
};

export default useSubject;
