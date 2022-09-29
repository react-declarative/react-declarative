import { useRef, useState, useEffect, useMemo, useLayoutEffect, useCallback } from 'react';

import Entity, { IEntity, CHANGE_DEBOUNCE } from "../utils/mvvm/Entity";

import useActualCallback from './useActualCallback';

export interface IParams<T extends IEntity = any> {
    initialValue: T | Entity<T> | (() => T);
    onChange?: (item: Entity<T>) => void;
    debounce?: number;
}

export class EntityAdapter<T extends IEntity = any> {
    constructor(private entity$: React.MutableRefObject<Entity<T>>) { }
    get data() {
        return this.entity$.current.data;
    };
    get id() {
        return this.entity$.current.id;
    };
    setData = (data: Partial<T> | ((prevData: T) => Partial<T>)) => {
        return this.entity$.current.setData(data as any);
    };
    toObject = () => this.entity$.current.toObject();
    refresh = () => this.entity$.current.refresh();
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
        handleChange(newEntity);
    }), [entity]);
    useLayoutEffect(() => () => {
        const { current: entity } = entity$;
        entity.handleDropChanges();
    }, []);
    return useMemo(() => new EntityAdapter<T>(entity$), [entity]);
};

export default useEntity;
