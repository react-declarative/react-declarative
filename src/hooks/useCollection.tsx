import { useRef, useState, useEffect, useMemo, useLayoutEffect, useCallback } from 'react';

import Collection from "../utils/mvvm/Collection";
import Entity, { IEntity, CHANGE_DEBOUNCE } from "../utils/mvvm/Entity";

import useActualCallback from './useActualCallback';

export interface IParams<T extends IEntity = any> {
    initialValue?: T[] | (() => T[]) | Entity<T>[] | Collection<T>;
    onChange?: (item: Collection<T>, target: Entity<T> | null) => void;
    debounce?: number;
}

class CollectionEntityAdapter<T extends IEntity = any> {
    constructor(public readonly id: IEntity['id'], private collection$: React.MutableRefObject<Collection<T>>) { }
    get data() {
        const entity = this.collection$.current.findById(this.id);
        return entity.data;
    };
    setData = (data: Partial<T> | ((prevData: T) => Partial<T>)) => {
        const entity = this.collection$.current.findById(this.id);
        return entity.setData(data);
    };
    toObject = () => {
        const entity = this.collection$.current.findById(this.id);
        return entity.toObject();
    };
    refresh = () => {
        const entity = this.collection$.current.findById(this.id);
        return entity.refresh();
    };
};

export class CollectionAdapter<T extends IEntity = any> {
    constructor(private collection$: React.MutableRefObject<Collection<T>>) { }
    get ids() {
        return this.collection$.current.ids;
    };
    get items() {
        return this.collection$.current.items
            .map(({ id }) => new CollectionEntityAdapter(id, this.collection$));
    };
    get isEmpty() {
        return this.collection$.current.isEmpty;
    };
    setData = (items: T[]) => {
        return this.collection$.current.setData(items);
    };
    clear = () => this.collection$.current.clear();
    push = (...items: T[]) => this.collection$.current.push(...items);
    remove = (entity: IEntity) => this.collection$.current.remove(entity);
    removeById = (id: string | number) => this.collection$.current.removeById(id);
    findById = (id: string | number) => {
        const entity = this.collection$.current.findById(id);
        return new CollectionEntityAdapter(entity.id, this.collection$);
    };
    some = (fn: (value: CollectionEntityAdapter<T>, idx: number) => boolean) => {
        return this.items.some(fn);
    };
    forEach = (fn: (value: CollectionEntityAdapter<T>, idx: number) => void) => {
        this.items.forEach(fn);
    };
    find = (fn: (value: CollectionEntityAdapter<T>, idx: number) => boolean) => {
        return this.items.find(fn);
    };
    filter = (fn: (value: CollectionEntityAdapter<T>, idx: number) => boolean) => {
        return this.items.filter(fn);
    };
    map = <V extends any = any>(fn: (value: CollectionEntityAdapter<T>, idx: number) => V) => {
        return this.items.map<V>(fn);
    };
    toArray = () => this.collection$.current.toArray();
    refresh = () => this.collection$.current.refresh();
};

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
    return useMemo(() => new CollectionAdapter<T>(collection$), [collection]);
};

export default useCollection;
