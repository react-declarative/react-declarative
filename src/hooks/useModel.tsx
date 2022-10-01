import { useRef, useState, useMemo, useEffect, useLayoutEffect, useCallback } from 'react';

import Model, { CHANGE_DEBOUNCE, IModelAdapter } from "../utils/mvvm/Model";
import BehaviorSubject from '../utils/rx/BehaviorSubject';
import Subject from '../utils/rx/Subject';

import useActualCallback from './useActualCallback';
import useSingleton from './useSingleton';

export interface IParams<T extends {} = any> {
    initialValue: T | Model<T> | (() => T);
    onChange?: (item: ModelAdapter<T>) => void;
    debounce?: number;
}

const WAIT_FOR_LISTENERS_DELAY = 10;

export class ModelAdapter<T extends {} = any> implements IModelAdapter<T> {
    private _waitForListeners = () => new Promise<boolean>((res) => {
        let isDisposed = false;
        const cleanup = this._dispose.subscribe(() => isDisposed = true);
        const process = () => {
            if (this._model$.current.hasListeners || isDisposed) {
                cleanup();
                res(isDisposed);
            } else {
                setTimeout(process, WAIT_FOR_LISTENERS_DELAY);
            }
        };
        process();
    });
    constructor(private _model$: React.MutableRefObject<Model<T>>, private _dispose: Subject<true>) { }
    public get data() {
        return this._model$.current.data;
    };
    public setData = async (data: Partial<T> | ((prevData: T) => Partial<T>)) => {
        await this._waitForListeners().then((isDisposed) => {
            if (isDisposed) {
                return;
            }
            this._model$.current.setData(data);
        });
    };
    public refresh = async () => {
        await this._waitForListeners().then((isDisposed) => {
            if (isDisposed) {
                return;
            }
            this._model$.current.refresh();
        });
    };
    public toObject = () => this._model$.current.toObject();
    public toModel = () => this._model$.current;
};

export const useModel = <T extends {} = any>({
    initialValue,
    onChange = () => null,
    debounce = CHANGE_DEBOUNCE
}: IParams<T>) => {
    const model$ = useRef<Model<T>>(null as never);
    const dispose$ = useSingleton(() => new BehaviorSubject<true>());
    const handlePrevData = useCallback(() => {
        return model$.current.data;
    }, []);
    const [model, setModel] = useState(() => new Model(initialValue, debounce, handlePrevData));
    model$.current = model;
    const handleChange = useActualCallback(onChange);
    useEffect(() => model.handleChange((model) => {
        if (!dispose$.data) {
            const newModel = new Model(model, debounce, handlePrevData);
            setModel(newModel);
            handleChange(new ModelAdapter(model$, dispose$));
        } 
    }), [model]);
    useLayoutEffect(() => () => {
        const { current: model } = model$;
        model.handleDropChanges();
        dispose$.next(true);
    }, []);
    return useMemo(() => new ModelAdapter<T>(model$, dispose$), [model]);
};

export default useModel;
