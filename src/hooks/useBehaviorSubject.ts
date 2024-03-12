import BehaviorSubject from "../utils/rx/BehaviorSubject";

import useSingleton from "./useSingleton";

/**
 * Initializes a new BehaviorSubject with optional initial data value.
 *
 * @template Data The type of data stored in the BehaviorSubject.
 * @param {Data | null} [data=null] The initial value of the BehaviorSubject. Defaults to null.
 * @returns {BehaviorSubject<Data>} The newly created BehaviorSubject instance.
 */
export const useBehaviorSubject = <Data = any>(data: Data | null = null) => {
    return useSingleton(() => new BehaviorSubject<Data>(data));
};

export default useBehaviorSubject;
