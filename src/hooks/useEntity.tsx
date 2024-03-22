import { useRef, useState, useEffect, useMemo, useLayoutEffect, useCallback } from 'react';
// import { flushSync } from 'react-dom';

import Entity, { IEntity, CHANGE_DEBOUNCE, IEntityAdapter } from "../utils/mvvm/Entity";
import BehaviorSubject from '../utils/rx/BehaviorSubject';
import Subject from '../utils/rx/Subject';

import sleep from '../utils/sleep';

import useActualCallback from './useActualCallback';
import useSingleton from './useSingleton';

/**
 * Represents the parameters for a class.
 *
 * @template T - The type of the entity.
 */
export interface IParams<T extends IEntity = any> {
    initialValue: T | Entity<T> | (() => T);
    onChange?: (item: EntityAdapter<T>) => void;
    debounce?: number;
}

const WAIT_FOR_LISTENERS_DELAY = 10;

/**
 * Class representing an Entity Adapter.
 *
 * @template T - The type of the entity.
 */
export class EntityAdapter<T extends IEntity = any> implements IEntityAdapter<T> {
    private _waitForListeners = () => new Promise<boolean>(async (res) => {
        let isDisposed = false;
        const cleanup = this._dispose.subscribe((value) => isDisposed = value);
        /** react-18 prevent batching */
        await sleep(0);
        const process = () => {
            if (this._entity$.current.hasListeners || isDisposed) {
                cleanup();
                res(isDisposed);
            } else {
                setTimeout(process, WAIT_FOR_LISTENERS_DELAY);
            }
        };
        process();
    });
    constructor(private _entity$: React.MutableRefObject<Entity<T>>, private _dispose: Subject<true>) { }
    get data() {
        return this._entity$.current.data;
    };
    get id() {
        return this._entity$.current.id;
    };
    setData = async (data: Partial<T> | ((prevData: T) => Partial<T>)) => {
        await this._waitForListeners().then((isDisposed) => {
            if (isDisposed) {
                return;
            }
            this._entity$.current.setData(data as any);
        });
    };
    refresh = async () => {
        await this._waitForListeners().then((isDisposed) => { 
            if (isDisposed) {
                return;
            }
            this._entity$.current.refresh();
        });
    };
    toObject = () => this._entity$.current.toObject();
    toEntity = () => this._entity$.current;
};

/**
 * Creates a hook that manages an entity state.
 *
 * @template T - The type of the entity.
 * @param params - The parameters to configure the hook.
 * @param params.initialValue - The initial value of the entity.
 * @param [params.onChange=() => null] - The callback function to execute when the entity changes.
 * @param [params.debounce=CHANGE_DEBOUNCE] - The debounce delay in milliseconds.
 * @returns - The entity adapter object.
 */
export const useEntity = <T extends IEntity = any>({
    initialValue,
    onChange = () => null,
    debounce = CHANGE_DEBOUNCE,
}: IParams<T>) => {
    const entity$ = useRef<Entity<T>>(null as never);
    const dispose$ = useSingleton(() => new BehaviorSubject<true>());
    const handlePrevData = useCallback(() => {
        return entity$.current.data;
    }, []);
    const [entity, setEntity] = useState(() => new Entity(initialValue, debounce, handlePrevData));
    entity$.current = entity;
    const handleChange = useActualCallback(onChange);
    useEffect(() => entity.handleChange((entity) => {
        if (!dispose$.data) {
            const newEntity = new Entity(entity, debounce, handlePrevData);
            entity$.current = newEntity;
            // flushSync(() => {
                setEntity(newEntity);
            // });
            handleChange(new EntityAdapter(entity$, dispose$));
        }
    }), [entity]);
    useLayoutEffect(() => () => {
        const { current: entity } = entity$;
        entity.handleDropChanges();
        dispose$.next(true);
    }, []);
    return useMemo(() => new EntityAdapter<T>(entity$, dispose$), [entity]);
};

export default useEntity;
