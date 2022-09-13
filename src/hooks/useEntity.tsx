import { useState, useEffect } from 'react';

import Entity, { IEntity, REFRESH_SYMBOL } from "../utils/mvvm/Entity";

import useActualCallback from './useActualCallback';

export interface IParams<T extends IEntity = any> {
    initialValue: Partial<T> | Entity<T> | (() => Partial<T>);
    onChange?: (item: Entity<T>) => void;
}

export const useEntity = <T extends IEntity = any>({
    initialValue,
    onChange = () => null,
}: IParams<T>) => {
    const [entity, setEntity] = useState(() => new Entity<T>(initialValue as T));
    const handleChange = useActualCallback(onChange);
    useEffect(() => entity.handleChange((entity) => {
        const newEntity = new Entity(entity);
        setEntity(newEntity);
        handleChange(newEntity);
    }), [entity]);
    useEffect(() => entity.once(REFRESH_SYMBOL, (entity) => {
        const newEntity = new Entity(entity);
        setEntity(newEntity);
        handleChange(newEntity);
    }), [entity]);
    return entity;
};

export default useEntity;
