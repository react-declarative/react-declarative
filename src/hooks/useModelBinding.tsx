import { useEffect, useState, useRef } from "react";

import { CHANGE_DEBOUNCE } from "../utils/mvvm/Model";
import Subject from "../utils/rx/Subject";

import useModel, { IParams as IModelParams, ModelAdapter } from "./useModel";
import useChangeSubject from "./useChangeSubject";
import useSingleton from "./useSingleton";
import useChange from "./useChange";

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
    const initComplete = useRef(false);

    const model = useModel<T>({
        initialValue: initialValue as T,
        onChange,
        debounce,
    });

    const emit = useChangeSubject(model);
    const change = useSingleton(() => new Subject<ModelAdapter<T>>());

    useEffect(() => emit.subscribe((model) => {
        if (!loading && initComplete.current) {
            change.next(model);
        }
    }), [loading]);

    useChange(() => {
        if (!loading) {
            initComplete.current = true;
        }
    }, [model]);

    useEffect(() => {
        return creator(model, change, () => {
            model.toModel().handleDropChanges();
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
