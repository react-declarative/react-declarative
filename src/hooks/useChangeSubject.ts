import Subject from "../utils/rx/Subject";

import useSingleton from "./useSingleton";
import useChange from "./useChange";

export const useChangeSubject = <T = undefined>(value: T) => {
    const subject = useSingleton(() => new Subject<T>());
    useChange(() => subject.next(value), [value]);
    return subject;
};

export default useChangeSubject;
