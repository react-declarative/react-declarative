import { useEffect } from "react";

import Subject, { TSubject } from "../utils/rx/Subject";

import useSingleton from "./useSingleton";

export const useSubject = <Data = any>(target?: TSubject<Data> | null) => {
    const result = useSingleton(() => new Subject<Data>());
    useEffect(() => {
        let dtor: any = undefined;
        if (target) {
            dtor = target.subscribe(result.next);
        }
        return dtor;
    }, [target]);
    return result;
};

export default useSubject;
