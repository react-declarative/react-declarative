import { useState, useEffect } from "react";

import { TSubject } from "../utils/rx/Subject";

/**
 * A function that retrieves and sets the value of a subject.
 *
 * @template Data - The type of data stored in the subject.
 * @param target - The subject to subscribe to.
 * @param [value] - The initial value for the subject, if not provided the subject's initial value will be used.
 * @returns - The current value of the subject.
 */
export const useSubjectValue = <Data = any>(target: TSubject<Data>, value?: Data | (() => Data)): Data => {
    const [data, setData] = useState<Data>(value!);
    useEffect(() => target.subscribe((data) => {
        setData(data);
    }), [target]);
    return data;
};

export default useSubjectValue;
