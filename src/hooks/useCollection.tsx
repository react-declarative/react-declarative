import { useRef, useState, useEffect, useMemo, useLayoutEffect, useCallback } from 'react';

import EventEmitter from '../utils/rx/EventEmitter';
import Collection, { ICollectionAdapter, EntityNotFoundError } from "../utils/mvvm/Collection";
import Entity, { IEntity, IEntityAdapter, CHANGE_DEBOUNCE } from "../utils/mvvm/Entity";

import useActualCallback from './useActualCallback';

export interface IParams<T extends IEntity = any> {
    initialValue?: T[] | (() => T[]) | Entity<T>[] | Collection<T>;
    onChange?: (item: ICollectionAdapter<T>, target: IEntityAdapter<T> | null) => void;
    debounce?: number;
}

class CollectionEntityAdapter<T extends IEntity = any> implements IEntityAdapter<T> {
    private _waitForListeners = (target: EventEmitter) => new Promise<void>((res) => {
        const process = () => {
            if (target.hasListeners) {
                res();
            } else {
                setTimeout(process, WAIT_FOR_LISTENERS_DELAY);
            }
        }
        process();
    });
    constructor(public readonly id: IEntity['id'], private collection$: React.MutableRefObject<Collection<T>>) { }
    public get data() {
        const entity = this.collection$.current.findById(this.id);
        return entity.data;
    };
    public setData = async (data: Partial<T> | ((prevData: T) => Partial<T>)) => {
        try {
            const entity = this.collection$.current.findById(this.id);
            await this._waitForListeners(entity).then(() => {
                entity.setData(data);
            });
        } catch (e) {
            if (e instanceof EntityNotFoundError) {
                console.error(`Entity (ID ${this.id}) not found in collection (setData)`);
            } else {
                throw e;
            }
        }
    };
    public refresh = async () => {
        try {
            const entity = this.collection$.current.findById(this.id);
            await this._waitForListeners(entity).then(() => {
                entity.refresh();
            });
        } catch (e) {
            if (e instanceof EntityNotFoundError) {
                console.error(`Entity (ID ${this.id}) not found in collection (setData)`);
            } else {
                throw e;
            }
        }
    };
    public toObject = () => {
        const entity = this.collection$.current.findById(this.id);
        return entity.toObject();
    };
};

const WAIT_FOR_LISTENERS_DELAY = 10;

export class CollectionAdapter<T extends IEntity = any> implements ICollectionAdapter<T> {
    private _waitForListeners = () => new Promise<void>((res) => {
        const process = () => {
            if (this.collection$.current.hasListeners) {
                res();
            } else {
                setTimeout(process, WAIT_FOR_LISTENERS_DELAY);
            }
        }
        process();
    });
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
    setData = async (items: T[]) => {
        await this._waitForListeners().then(() => {
            this.collection$.current.setData(items);
        });
    };
    refresh = async () => {
        await this._waitForListeners().then(() => {
            this.collection$.current.refresh();
        });
    };
    clear = async () => {
        await this._waitForListeners().then(() => {
            this.collection$.current.clear();
        });
    };
    push = async (...items: T[]) => {
        await this._waitForListeners().then(() => {
            this.collection$.current.push(...items)
        });
    };
    remove = async (entity: IEntity) => {
        await this._waitForListeners().then(() => {
            this.collection$.current.remove(entity);
        });
    };
    removeById = async (id: string | number) => {
        await this._waitForListeners().then(() => {  
            this.collection$.current.removeById(id);
        });
    };
    findById = (id: string | number) => {
        const entity = this.collection$.current.findById(id);
        return new CollectionEntityAdapter(entity.id, this.collection$);
    };
    some = (fn: (value: IEntityAdapter<T>, idx: number) => boolean) => {
        return this.items.some(fn);
    };
    forEach = (fn: (value: IEntityAdapter<T>, idx: number) => void) => {
        this.items.forEach(fn);
    };
    find = (fn: (value: IEntityAdapter<T>, idx: number) => boolean) => {
        return this.items.find(fn);
    };
    filter = (fn: (value: IEntityAdapter<T>, idx: number) => boolean) => {
        return this.items.filter(fn);
    };
    map = <V extends any = any>(fn: (value: IEntityAdapter<T>, idx: number) => V) => {
        return this.items.map<V>(fn);
    };
    toArray = () => this.collection$.current.toArray();
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
        handleChange(new CollectionAdapter<T>(collection$), target ? new CollectionEntityAdapter(target.id, collection$) : null);
    }), [collection]);
    useLayoutEffect(() => () => {
        const { current: collection } = collection$;
        collection.handleDropChanges();
    }, []);
    return useMemo(() => new CollectionAdapter<T>(collection$), [collection]);
};

export default useCollection;
