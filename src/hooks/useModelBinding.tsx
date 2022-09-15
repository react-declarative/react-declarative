import React, { useEffect, useState } from "react";

import Model, { CHANGE_DEBOUNCE } from "../utils/mvvm/Model";
import Subject from "../utils/rx/Subject";

import useActualValue from "./useActualValue";
import useChangeSubject from "./useChangeSubject";
import useModel, { IParams as IModelParams } from "./useModel";

interface IParams<T extends {} = any> extends Omit<IModelParams<T>, keyof {
    initialValue: never;
}> {
    creator: (model: React.MutableRefObject<Model<T>>, change: Subject<Model<T>>, begin: () => void) => (() => void) | void;
    initialValue?: Partial<T> | Model<T> | (() => Partial<T>);
}

export const useModelBinding = <T extends {} = any>({
    creator,
    onChange,
    initialValue = {},
    debounce = CHANGE_DEBOUNCE,
}: IParams<T>) => {

    const [loading, setLoading] = useState(true);

    const model = useModel<T>({
        initialValue: initialValue as T,
        onChange,
        debounce,
    });

    const model$ = useActualValue(model);

    const subject = useChangeSubject(model);

    useEffect(() => {
        return creator(model$, subject, () => {
            model$.current.refresh();
            setLoading(false);
        });
    }, []);

    if (loading) {
        return null;
    } else {
        return model;
    }

}

export default useModelBinding;
