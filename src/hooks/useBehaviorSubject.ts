import BehaviorSubject from "../utils/rx/BehaviorSubject";

import useSingleton from "./useSingleton";

export const useBehaviorSubject = <Data = any>(data: Data | null = null) => {
    return useSingleton(() => new BehaviorSubject<Data>(data));
};

export default useBehaviorSubject;
