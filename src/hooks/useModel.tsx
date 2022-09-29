import { useRef, useState, useMemo, useEffect, useLayoutEffect, useCallback } from 'react';

import Model, { CHANGE_DEBOUNCE } from "../utils/mvvm/Model";

import useActualCallback from './useActualCallback';

export interface IParams<T extends {} = any> {
    initialValue: T | Model<T> | (() => T);
    onChange?: (item: Model<T>) => void;
    debounce?: number;
}

export class ModelAdapter<T extends {} = any> {
    constructor(private model$: React.MutableRefObject<Model<T>>) { }
    get data() {
        return this.model$.current.data;
    };
    setData = (data: Partial<T> | ((prevData: T) => Partial<T>)) => {
        return this.model$.current.setData(data);
    };
    toObject = () => this.model$.current.toObject();
    refresh = () => this.model$.current.refresh();
};

export const useModel = <T extends {} = any>({
    initialValue,
    onChange = () => null,
    debounce = CHANGE_DEBOUNCE
}: IParams<T>) => {
    const model$ = useRef<Model<T>>(null as never);
    const handlePrevData = useCallback(() => {
        return model$.current.data;
    }, []);
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
    return useMemo(() => new ModelAdapter<T>(model$), [model]);
};

export default useModel;
