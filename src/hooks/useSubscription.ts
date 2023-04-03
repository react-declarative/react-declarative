import { useEffect, useRef } from "react";

import { TSubject } from "../utils/rx/Subject";
import TObserver from "../model/TObserver";

import useSingleton from "./useSingleton";

type Target<Data = any> = TSubject<Data> | TObserver<Data>;
type Fn = () => void;

export const useSubscription = <Data = any>(target: Target<Data> | (() => Target<Data>), callbackfn: (data: Data) => void, ...deps: any[]) => {
    const value = useSingleton(target);
    const disposeRef = useRef<Fn>();
    useEffect(() => {
        let isDirty = true;
        isDirty = isDirty && typeof target !== 'function';
        isDirty = isDirty && value !== target;
        isDirty = isDirty && target ? ('connect' in target) : false;
        if (isDirty) {
            (target as TObserver<Data>).unsubscribe();
        }
    }, [target]);
    useEffect(() => {
        let dtor: any = undefined;
        if ('subscribe' in value) {
            dtor = value.subscribe(callbackfn);
        }
        if ('connect' in value) {
            dtor = value.connect(callbackfn);
        }
        if (deps.length) {
            disposeRef.current && disposeRef.current();
            disposeRef.current = dtor;
            return;
        }
        return dtor;
    }, deps);
    useEffect(() => () => {
        if ('unsubscribe' in target) {
            target.unsubscribe();
        }
        disposeRef.current && disposeRef.current();
    }, []);
};

export default useSubscription;
