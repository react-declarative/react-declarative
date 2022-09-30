import { useRef, useState, useEffect, useMemo, useLayoutEffect, useCallback } from 'react';

import Entity, { IEntity, CHANGE_DEBOUNCE, IEntityAdapter } from "../utils/mvvm/Entity";

import useActualCallback from './useActualCallback';

export interface IParams<T extends IEntity = any> {
    initialValue: T | Entity<T> | (() => T);
    onChange?: (item: IEntityAdapter<T>) => void;
    debounce?: number;
}

const WAIT_FOR_LISTENERS_DELAY = 10;

export class EntityAdapter<T extends IEntity = any> implements IEntityAdapter<T> {
    private _waitForListeners = () => new Promise<void>((res) => {
        const process = () => {
            if (this.entity$.current.hasListeners) {
                res();
            } else {
                setTimeout(process, WAIT_FOR_LISTENERS_DELAY);
            }
        }
        process();
    });
    constructor(private entity$: React.MutableRefObject<Entity<T>>) { }
    get data() {
        return this.entity$.current.data;
    };
    get id() {
        return this.entity$.current.id;
    };
    setData = async (data: Partial<T> | ((prevData: T) => Partial<T>)) => {
        await this._waitForListeners().then(() => {
            this.entity$.current.setData(data as any);
        });
    };
    refresh = async () => {
        await this._waitForListeners().then(() => {    
            this.entity$.current.refresh();
        });
    };
    toObject = () => this.entity$.current.toObject();
};

export const useEntity = <T extends IEntity = any>({
    initialValue,
    onChange = () => null,
    debounce = CHANGE_DEBOUNCE,
}: IParams<T>) => {
    const entity$ = useRef<Entity<T>>(null as never);
    const handlePrevData = useCallback(() => {
        return entity$.current.data;
    }, []);
    const [entity, setEntity] = useState(() => new Entity(initialValue, debounce, handlePrevData));
    entity$.current = entity;
    const handleChange = useActualCallback(onChange);
    useEffect(() => entity.handleChange((entity) => {
        const newEntity = new Entity(entity, debounce, handlePrevData);
        setEntity(newEntity);
        handleChange(new EntityAdapter(entity$));
    }), [entity]);
    useLayoutEffect(() => () => {
        const { current: entity } = entity$;
        entity.handleDropChanges();
    }, []);
    return useMemo(() => new EntityAdapter<T>(entity$), [entity]);
};

export default useEntity;
