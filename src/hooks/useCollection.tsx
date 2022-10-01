import { useRef, useState, useEffect, useMemo, useLayoutEffect, useCallback } from 'react';

import BehaviorSubject from '../utils/rx/BehaviorSubject';
import EventEmitter from '../utils/rx/EventEmitter';
import Subject from '../utils/rx/Subject';

import Collection, { ICollectionAdapter, EntityNotFoundError } from "../utils/mvvm/Collection";
import Entity, { IEntity, IEntityAdapter, CHANGE_DEBOUNCE } from "../utils/mvvm/Entity";

import useActualCallback from './useActualCallback';
import useSingleton from './useSingleton';

export interface IParams<T extends IEntity = any> {
    initialValue?: T[] | (() => T[]) | Entity<T>[] | Collection<T>;
    onChange?: (item: CollectionAdapter<T>, target: CollectionEntityAdapter<T> | null) => void;
    debounce?: number;
}

export class CollectionEntityAdapter<T extends IEntity = any> implements IEntityAdapter<T> {
    private _waitForListeners = (target: EventEmitter) => new Promise<boolean>((res) => {
        let isDisposed = false;
        const cleanup = this._dispose.subscribe((value) => isDisposed = value);
        const process = () => {
            if (target.hasListeners || isDisposed) {
                cleanup();
                res(isDisposed);
            } else {
                setTimeout(process, WAIT_FOR_LISTENERS_DELAY);
            }
        }
        process();
    });
    constructor(public readonly id: IEntity['id'], private _collection$: React.MutableRefObject<Collection<T>>, private _dispose: Subject<true>) { }
    public get data() {
        try {
            const entity = this._collection$.current.findById(this.id);
            return entity.data;
        } catch (e) {
            if (e instanceof EntityNotFoundError) {
                throw new Error(`Entity (ID ${this.id}) not found in collection (data getter)`);
            } else {
                throw e;
            }
        }
    };
    public setData = async (data: Partial<T> | ((prevData: T) => Partial<T>)) => {
        try {
            const entity = this._collection$.current.findById(this.id);
            await this._waitForListeners(entity).then((isDisposed) => {
                if (isDisposed) {
                    return;
                }
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
            const entity = this._collection$.current.findById(this.id);
            await this._waitForListeners(entity).then((isDisposed) => {
                if (isDisposed) {
                    return;
                }
                entity.refresh();
            });
        } catch (e) {
            if (e instanceof EntityNotFoundError) {
                console.error(`Entity (ID ${this.id}) not found in collection (refresh)`);
            } else {
                throw e;
            }
        }
    };
    public toObject = () => {
        try {
            const entity = this._collection$.current.findById(this.id);
            return entity.toObject();
        } catch (e) {
            if (e instanceof EntityNotFoundError) {
                throw new Error(`Entity (ID ${this.id}) not found in collection (toObject)`);
            } else {
                throw e;
            }
        }
    };
    public toEntity = () => {
        try {
            return this._collection$.current.findById(this.id);
        } catch (e) {
            if (e instanceof EntityNotFoundError) {
                throw new Error(`Entity (ID ${this.id}) not found in collection (toEntity)`);
            } else {
                throw e;
            }
        }
    };
};

const WAIT_FOR_LISTENERS_DELAY = 10;

export class CollectionAdapter<T extends IEntity = any> implements ICollectionAdapter<T> {
    private _waitForListeners = () => new Promise<boolean>((res) => {
        let isDisposed = false;
        const cleanup = this._dispose.subscribe((value) => isDisposed = value);
        const process = () => {
            if (this._collection$.current.hasListeners || isDisposed) {
                cleanup();
                res(isDisposed);
            } else {
                setTimeout(process, WAIT_FOR_LISTENERS_DELAY);
            }
        };
        process();
    });
    constructor(private _collection$: React.MutableRefObject<Collection<T>>, private _dispose: Subject<true>) { }
    get ids() {
        return this._collection$.current.ids;
    };
    get items() {
        return this._collection$.current.items
            .map(({ id }) => new CollectionEntityAdapter(id, this._collection$, this._dispose));
    };
    get isEmpty() {
        return this._collection$.current.isEmpty;
    };
    setData = async (items: T[]) => {
        await this._waitForListeners().then((isDisposed) => {
            if (isDisposed) {
                return;
            }
            this._collection$.current.setData(items);
        });
    };
    refresh = async () => {
        await this._waitForListeners().then((isDisposed) => {
            if (isDisposed) {
                return;
            }
            this._collection$.current.refresh();
        });
    };
    clear = async () => {
        await this._waitForListeners().then((isDisposed) => {
            if (isDisposed) {
                return;
            }
            this._collection$.current.clear();
        });
    };
    push = async (...items: T[]) => {
        await this._waitForListeners().then((isDisposed) => {
            if (isDisposed) {
                return;
            }
            this._collection$.current.push(...items)
        });
    };
    remove = async (entity: IEntity) => {
        await this._waitForListeners().then((isDisposed) => {
            if (isDisposed) {
                return;
            }
            this._collection$.current.remove(entity);
        });
    };
    removeById = async (id: string | number) => {
        await this._waitForListeners().then((isDisposed) => {
            if (isDisposed) {
                return;
            }
            this._collection$.current.removeById(id);
        });
    };
    findById = (id: string | number) => {
        const entity = this._collection$.current.findById(id);
        return new CollectionEntityAdapter(entity.id, this._collection$, this._dispose);
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
    toArray = () => this._collection$.current.toArray();
    toCollection = () => this._collection$.current;
};

export const useCollection = <T extends IEntity = any>({
    initialValue = [],
    onChange = () => null,
    debounce = CHANGE_DEBOUNCE,
}: IParams<T> = {}) => {
    const collection$ = useRef<Collection<T>>(null as never);
    const dispose$ = useSingleton(() => new BehaviorSubject<true>());
    const handlePrevData = useCallback(() => {
        return collection$.current.items;
    }, []);
    const [collection, setCollection] = useState(() => new Collection<T>(initialValue, debounce, handlePrevData));
    collection$.current = collection;
    const handleChange = useActualCallback(onChange);
    useEffect(() => collection.handleChange((collection, target) => {
        if (!dispose$.data) {
            const newCollection = new Collection<T>(collection, debounce, handlePrevData);
            setCollection(newCollection);
            handleChange(new CollectionAdapter<T>(collection$, dispose$), target ? new CollectionEntityAdapter(target.id, collection$, dispose$) : null);
        }
    }), [collection]);
    useLayoutEffect(() => () => {
        const { current: collection } = collection$;
        collection.handleDropChanges();
        dispose$.next(true);
    }, []);
    return useMemo(() => new CollectionAdapter<T>(collection$, dispose$), [collection]);
};

export default useCollection;
