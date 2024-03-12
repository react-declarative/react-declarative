import { useEffect } from "react";

import Subject, { TSubject } from "../utils/rx/Subject";

import useSingleton from "./useSingleton";

/**
 * Creates and returns a subject that can be subscribed to.
 *
 * @template Data - The data type of the subject.
 * @param {TSubject<Data> | null} target - An optional target subject to subscribe to.
 * @returns {Subject<Data>} - The created subject.
 */
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
