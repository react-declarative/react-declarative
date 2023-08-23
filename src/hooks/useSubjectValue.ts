import { useState, useEffect } from "react";

import { TSubject } from "../utils/rx/Subject";

export const useSubjectValue = <Data = any>(target: TSubject<Data>): Data | null => {
    const [data, setData] = useState<Data | null>(null);
    useEffect(() => target.subscribe((data) => {
        setData(data);
    }), [target]);
    return data;
};

export default useSubjectValue;
