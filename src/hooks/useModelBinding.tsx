import { useEffect, useState, useRef } from "react";

import { CHANGE_DEBOUNCE } from "../utils/mvvm/Model";
import Subject from "../utils/rx/Subject";

import useModel, { IParams as IModelParams, ModelAdapter } from "./useModel";
import useChangeSubject from "./useChangeSubject";
import useSingleton from "./useSingleton";
import useChange from "./useChange";

/**
 * Represents the interface for defining parameters of a class.
 * @template T - The type of the model.
 */
interface IParams<T extends {} = any> extends Omit<IModelParams<T>, keyof {
    initialValue: never;
    onChange: never;
}> {
    creator: (model: ModelAdapter<T>, change: Subject<ModelAdapter<T>>, begin: () => void) => (() => void) | void;
    initialValue?: Partial<T> | (() => Partial<T>);
    onChange?: (item: ModelAdapter<T>, initial: boolean) => void;
}

/**
 * A custom hook for handling model binding and state management.
 *
 * @template T - The type of the model data
 *
 * @param params - The parameters for configuring the model binding
 * @param params.creator - A callback function for initializing the model
 * @param [params.onChange] - A callback function to be called when the model changes
 * @param [params.initialValue] - The initial value for the model
 * @param [params.debounce] - The debounce time (in milliseconds) for onChange event
 *
 * @returns - The model data or null if still loading
 */
export const useModelBinding = <T extends {} = any>({
    creator,
    onChange,
    initialValue = {},
    debounce = CHANGE_DEBOUNCE,
}: IParams<T>) => {

    const [loading, setLoading] = useState(true);
    const initComplete = useRef(false);

    const handleChange = (item: ModelAdapter<T>) => onChange && onChange(item, !initComplete.current);

    const model = useModel<T>({
        initialValue: initialValue as T,
        onChange: handleChange,
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
