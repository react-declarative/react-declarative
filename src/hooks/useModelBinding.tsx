import { useEffect, useState } from "react";

import { CHANGE_DEBOUNCE } from "../utils/mvvm/Model";
import Subject from "../utils/rx/Subject";

import useChangeSubject from "./useChangeSubject";
import useModel, { IParams as IModelParams, ModelAdapter } from "./useModel";

interface IParams<T extends {} = any> extends Omit<IModelParams<T>, keyof {
    initialValue: never;
}> {
    creator: (model: ModelAdapter<T>, change: Subject<ModelAdapter<T>>, begin: () => void) => (() => void) | void;
    initialValue?: Partial<T> | (() => Partial<T>);
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

    const subject = useChangeSubject(model);

    useEffect(() => {
        return creator(model, subject, () => {
            model.refresh();
            setLoading(false);
        });
    }, []);

    if (loading) {
        return null;
    } else {
        return model;
    }

};

export default useModelBinding;
