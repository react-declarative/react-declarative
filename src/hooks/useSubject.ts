import { useEffect } from "react";
import Subject from "../utils/rx/Subject";

import useSingleton from "./useSingleton";

export const useSubject = <Data = any>(upperSubject?: Subject<Data> | null) => {
    const result = useSingleton(() => new Subject<Data>());
    useEffect(() => {
        let dtor: any = undefined;
        if (upperSubject) {
            dtor = upperSubject.subscribe(result.next);
        }
        return dtor;
    }, [upperSubject]);
    return result;
};

export default useSubject;
