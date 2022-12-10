import Subject from "../utils/rx/Subject";

import useSingleton from "./useSingleton";

export const useSubject = <Data = any>() => {
    return useSingleton(() => new Subject<Data>());
};

export default useSubject;
