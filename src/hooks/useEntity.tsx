import { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';

import Entity, { IEntity, CHANGE_DEBOUNCE } from "../utils/mvvm/Entity";

import useActualCallback from './useActualCallback';

export interface IParams<T extends IEntity = any> {
    initialValue: T | Entity<T> | (() => T);
    onChange?: (item: Entity<T>) => void;
    debounce?: number;
}

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
    return entity;
};

export default useEntity;
