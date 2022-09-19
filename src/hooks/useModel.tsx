import { useState, useEffect, useLayoutEffect } from 'react';

import Model, { REFRESH_SYMBOL, CHANGE_DEBOUNCE } from "../utils/mvvm/Model";

import useActualCallback from './useActualCallback';
import useActualValue from './useActualValue';

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
    const [model, setModel] = useState(() => new Model(initialValue, debounce));
    const handleChange = useActualCallback(onChange);
    useEffect(() => model.handleChange((model) => {
        const newModel = new Model(model, debounce);
        setModel(newModel);
        handleChange(newModel);
    }), [model]);
    useEffect(() => model.once(REFRESH_SYMBOL, (model) => {
        const newModel = new Model(model, debounce);
        setModel(newModel);
        handleChange(newModel);
    }), [model]);
    const model$ = useActualValue(model);
    useLayoutEffect(() => () => {
        const { current: model } = model$;
        model.handleDropChanges();
    }, []);
    return model;
};

export default useModel;
