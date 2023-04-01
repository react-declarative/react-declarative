import { useEffect } from "react";

import Subject, { TSubject } from "../utils/rx/Subject";
import TObserver from "../model/TObserver";

import useSingleton from "./useSingleton";

export const useSubject = <Data = any>(upperSubject?: TSubject<Data> | TObserver<Data> | null) => {
    const result = useSingleton(() => new Subject<Data>());
    useEffect(() => {
        let dtor: any = undefined;
        if (upperSubject) {
            if ('subscribe' in upperSubject) {
                dtor = upperSubject.subscribe(result.next);
            }
            if ('connect' in upperSubject) {
                dtor = upperSubject.connect(result.next);
            }
        }
        return dtor;
    }, [upperSubject]);
    return result;
};

export default useSubject;
