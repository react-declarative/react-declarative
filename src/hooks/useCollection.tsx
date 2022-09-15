import { useState, useEffect } from 'react';

import Collection from "../utils/mvvm/Collection";
import Entity, { IEntity, REFRESH_SYMBOL, CHANGE_DEBOUNCE } from "../utils/mvvm/Entity";

import useActualCallback from './useActualCallback';

export interface IParams<T extends IEntity = any> {
    initialValue?: T[] | (() => T[]) | Entity<T>[] | Collection<T>;
    onChange?: (item: Collection<T>, target: Entity<T> | null) => void;
    debounce?: number;
}

export const useCollection = <T extends IEntity = any>({
    initialValue = [],
    onChange = () => null,
    debounce = CHANGE_DEBOUNCE,
}: IParams<T> = {}) => {
    const [collection, setCollection] = useState(() => new Collection(initialValue, debounce));
    const handleChange = useActualCallback(onChange);
    useEffect(() => collection.handleChange((collection, target) => {
        const newCollection = new Collection(collection, debounce);
        setCollection(newCollection);
        handleChange(newCollection, target);
    }), [collection]);
    useEffect(() => collection.once(REFRESH_SYMBOL, (collection, target) => {
        const newCollection = new Collection(collection, debounce);
        setCollection(newCollection);
        handleChange(newCollection, target);
    }), [collection]);
    return collection;
};

export default useCollection;
