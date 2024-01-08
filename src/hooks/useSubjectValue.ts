import { useState, useEffect } from "react";

import { TSubject } from "../utils/rx/Subject";

export const useSubjectValue = <Data = any>(target: TSubject<Data>, value?: Data | (() => Data)): Data => {
    const [data, setData] = useState<Data>(value!);
    useEffect(() => target.subscribe((data) => {
        setData(data);
    }), [target]);
    return data;
};

export default useSubjectValue;
