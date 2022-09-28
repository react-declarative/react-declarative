import { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';

import Collection from "../utils/mvvm/Collection";
import Entity, { IEntity, CHANGE_DEBOUNCE } from "../utils/mvvm/Entity";

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
    const collection$ = useRef<Collection<T>>(null as never);
    const handlePrevData = useCallback(() => {
        return collection$.current.items;
    }, []);
    const [collection, setCollection] = useState(() => new Collection<T>(initialValue, debounce, handlePrevData));
    collection$.current = collection;
    const handleChange = useActualCallback(onChange);
    useEffect(() => collection.handleChange((collection, target) => {
        const newCollection = new Collection<T>(collection, debounce, handlePrevData);
        setCollection(newCollection);
        handleChange(newCollection, target);
    }), [collection]);
    useLayoutEffect(() => () => {
        const { current: collection } = collection$;
        collection.handleDropChanges();
    }, []);
    return collection;
};

export default useCollection;
