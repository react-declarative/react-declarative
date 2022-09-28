import { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';

import Model, { CHANGE_DEBOUNCE } from "../utils/mvvm/Model";

import useActualCallback from './useActualCallback';

export interface IParams<T extends {} = any> {
    initialValue: T | Model<T> | (() => T);
    onChange?: (item: Model<T>) => void;
    debounce?: number;
}

export const useModel = <T extends {} = any>({
    initialValue,
    onChange = () => null,
    debounce = CHANGE_DEBOUNCE
}: IParams<T>) => {
    const model$ = useRef<Model<T>>(null as never);
    const [model, setModel] = useState(() => new Model(initialValue, debounce, handlePrevData));
    model$.current = model;
    const handleChange = useActualCallback(onChange);
    useEffect(() => model.handleChange((model) => {
        const newModel = new Model(model, debounce, handlePrevData);
        setModel(newModel);
        handleChange(newModel);
    }), [model]);
    useLayoutEffect(() => () => {
        const { current: model } = model$;
        model.handleDropChanges();
    }, []);
    const handlePrevData = useCallback(() => {
        return model$.current.data;
    }, []);
    return model;
};

export default useModel;
