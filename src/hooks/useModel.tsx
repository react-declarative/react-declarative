import { useRef, useState, useMemo, useEffect, useLayoutEffect, useCallback } from 'react';

import Model, { CHANGE_DEBOUNCE, IModelAdapter } from "../utils/mvvm/Model";

import useActualCallback from './useActualCallback';

export interface IParams<T extends {} = any> {
    initialValue: T | Model<T> | (() => T);
    onChange?: (item: ModelAdapter<T>) => void;
    debounce?: number;
}

const WAIT_FOR_LISTENERS_DELAY = 10;

export class ModelAdapter<T extends {} = any> implements IModelAdapter<T> {
    private _waitForListeners = () => new Promise<void>((res) => {
        const process = () => {
            if (this.model$.current.hasListeners) {
                res();
            } else {
                setTimeout(process, WAIT_FOR_LISTENERS_DELAY);
            }
        }
        process();
    });
    constructor(private model$: React.MutableRefObject<Model<T>>) { }
    public get data() {
        return this.model$.current.data;
    };
    public setData = async (data: Partial<T> | ((prevData: T) => Partial<T>)) => {
        await this._waitForListeners().then(() => {
            this.model$.current.setData(data);
        });
    };
    public refresh = async () => {
        await this._waitForListeners().then(() => {
            this.model$.current.refresh();
        });
    };
    public toObject = () => this.model$.current.toObject();
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
        handleChange(new ModelAdapter(model$));
    }), [model]);
    useLayoutEffect(() => () => {
        const { current: model } = model$;
        model.handleDropChanges();
    }, []);
    return useMemo(() => new ModelAdapter<T>(model$), [model]);
};

export default useModel;
