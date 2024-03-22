import { useRef, useState, useMemo, useEffect, useLayoutEffect, useCallback } from 'react';
// import { flushSync } from 'react-dom';

import Model, { CHANGE_DEBOUNCE, IModelAdapter } from "../utils/mvvm/Model";
import BehaviorSubject from '../utils/rx/BehaviorSubject';
import Subject from '../utils/rx/Subject';

import sleep from '../utils/sleep';

import useActualCallback from './useActualCallback';
import useSingleton from './useSingleton';

/**
 * Represents the parameters for a class.
 * @template T - The type of the initial value.
 */
export interface IParams<T extends {} = any> {
    initialValue: T | Model<T> | (() => T);
    onChange?: (item: ModelAdapter<T>) => void;
    debounce?: number;
}

const WAIT_FOR_LISTENERS_DELAY = 10;

/**
 * ModelAdapter class that implements the IModelAdapter interface.
 * It adapts a React.MutableRefObject<Model<T>> and provides methods to interact with the underlying model.
 */
export class ModelAdapter<T extends {} = any> implements IModelAdapter<T> {
    /**
     * Waits for listeners to be added to the current model before resolving.
     * @returns A promise that resolves to `true` if the model was disposed before listeners were added, otherwise `false`.
     */
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
    /**
     * Retrieves the current data value from the model.
     *
     * @returns The current data value.
     */
    public get data() {
        return this._model$.current.data;
    };
    /**
     * Sets the data of the variable.
     *
     * @param data - The data to set. It can be a partial object of type T or a function that accepts the previous data and returns a partial
     * object of type T.
     * @returns - A promise that resolves when the data is set.
     */
    public setData = async (data: Partial<T> | ((prevData: T) => Partial<T>)) => {
        await this._waitForListeners().then((isDisposed) => {
            if (isDisposed) {
                return;
            }
            this._model$.current.setData(data)
        });
    };
    /**
     * Asynchronously refreshes the current model.
     *
     * @returns A Promise that resolves when the model has been refreshed.
     */
    public refresh = async () => {
        await this._waitForListeners().then((isDisposed) => {
            if (isDisposed) {
                return;
            }
            this._model$.current.refresh();
        });
    };
    /**
     * Converts the current state of the object to a plain JavaScript object.
     *
     * @function toObject
     * @instance
     * @returns The object converted to a plain JavaScript object.
     */
    public toObject = () => this._model$.current.toObject();
    /**
     * Retrieves the current state of the model.
     *
     * @returns The current state of the model.
     */
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
