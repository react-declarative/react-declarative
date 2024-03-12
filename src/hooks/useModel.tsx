import { useRef, useState, useMemo, useEffect, useLayoutEffect, useCallback } from 'react';
// import { flushSync } from 'react-dom';

import Model, { CHANGE_DEBOUNCE, IModelAdapter } from "../utils/mvvm/Model";
import BehaviorSubject from '../utils/rx/BehaviorSubject';
import Subject from '../utils/rx/Subject';

import sleep from '../utils/sleep';

import useActualCallback from './useActualCallback';
import useSingleton from './useSingleton';

export interface IParams<T extends {} = any> {
    initialValue: T | Model<T> | (() => T);
    onChange?: (item: ModelAdapter<T>) => void;
    debounce?: number;
}

const WAIT_FOR_LISTENERS_DELAY = 10;

export class ModelAdapter<T extends {} = any> implements IModelAdapter<T> {
    private _waitForListeners = () => new Promise<boolean>(async (res) => {
        let isDisposed = false;
        const cleanup = this._dispose.subscribe(() => isDisposed = true);
        /** react-18 prevent batching */
        await sleep(0);
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
            this._model$.current.setData(data)
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

/**
 * Custom hook that creates and manages a model object for a given value.
 *
 * @template T - The type of the initial value and model data.
 * @param params - The parameters for the useModel hook.
 * @param params.initialValue - The initial value for the model.
 * @param [params.onChange=() => null] - The function to be called whenever the model value changes.
 * @param [params.debounce=CHANGE_DEBOUNCE] - The debounce value for handling model value changes.
 * @returns - The model adapter object.
 */
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
            model$.current = newModel;
            // flushSync(() => {
                setModel(newModel);
            // });
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
