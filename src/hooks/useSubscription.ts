import { useEffect } from "react";

import { TSubject } from "../utils/rx/Subject";
import TObserver from "../model/TObserver";

import useSingleton from "./useSingleton";

type Target<Data = any> = TSubject<Data> | TObserver<Data>;

export const useSubscription = <Data = any>(target: Target<Data> | (() => Target<Data>), callbackfn: (data: Data) => void, ...deps: any[]) => {
    const value = useSingleton(target);
    if (value !== target && 'connect' in target) {
        target.unsubscribe();
    }
    useEffect(() => {
        let dtor: any = undefined;
        if ('subscribe' in value) {
            dtor = value.subscribe(callbackfn);
        }
        if ('connect' in value) {
            dtor = value.connect(callbackfn);
        }
        return dtor;
    }, [value, ...deps]);
};

export default useSubscription;
