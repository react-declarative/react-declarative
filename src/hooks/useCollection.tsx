import { useState, useEffect } from 'react';

import Collection from "../utils/mvvm/Collection";
import Entity, { IEntity, REFRESH_SYMBOL } from "../utils/mvvm/Entity";

import useActualCallback from './useActualCallback';

interface IParams<T extends IEntity = any> {
    initialValue?: T[] | (() => T[]) | Entity<T>[] | Collection<T>;
    onChange?: (item: Collection<T>, target: Entity<T> | null) => void;
}

export const useCollection = <T extends IEntity = any>({
    initialValue = [],
    onChange = () => null,
}: IParams<T> = {}) => {
    const [collection, setCollection] = useState(() => new Collection(initialValue));
    const handleChange = useActualCallback(onChange);
    useEffect(() => collection.handleChange((collection, target) => {
        const newCollection = new Collection(collection);
        setCollection(newCollection);
        handleChange(newCollection, target);
    }), [collection]);
    useEffect(() => collection.once(REFRESH_SYMBOL, (collection, target) => {
        const newCollection = new Collection(collection);
        setCollection(newCollection);
        handleChange(newCollection, target);
    }), [collection]);
    return collection;
};

export default useCollection;
