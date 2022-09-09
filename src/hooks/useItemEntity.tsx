import { useState, useEffect } from 'react';

import Entity, { IEntity } from "../utils/mvvm/Entity";

export const useItemEntity = <T extends IEntity>(initialValue: T | Entity<T>) => {
    const [entity, setEntity] = useState(() => new Entity(initialValue));
    useEffect(() => entity.handleChange((entity) => setEntity(new Entity(entity))), []);
    return entity;
};

export default useItemEntity;
