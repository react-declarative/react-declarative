import Subject from "../utils/rx/Subject";

import useSingleton from "./useSingleton";
import useChange from "./useChange";

/**
 * Creates a subject that emits the given value whenever it changes.
 *
 * @template T - The type of the value to be emitted by the subject.
 *
 * @param {T} value - The initial value of the subject.
 *
 * @returns {Subject<T>} - The subject that emits the value whenever it changes.
 */
export const useChangeSubject = <T = undefined>(value: T) => {
    const subject = useSingleton(() => new Subject<T>());
    useChange(() => void subject.next(value), [value]);
    return subject;
};

export default useChangeSubject;
