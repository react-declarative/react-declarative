import { useRef, useState, useEffect, useMemo, useLayoutEffect, useCallback } from 'react';
// import { flushSync } from 'react-dom';

import BehaviorSubject from '../utils/rx/BehaviorSubject';
import Subject from '../utils/rx/Subject';

import sleep from '../utils/sleep';

import Collection, { ICollectionAdapter, EntityNotFoundError } from "../utils/mvvm/Collection";
import Entity, { IEntity, IEntityAdapter, CHANGE_DEBOUNCE } from "../utils/mvvm/Entity";

import useActualCallback from './useActualCallback';
import useSingleton from './useSingleton';

/**
 * Interface representing the parameters for a specific operation.
 *
 * @template T - Type of the entity.
 */
export interface IParams<T extends IEntity = any> {
    initialValue?: T[] | (() => T[]) | Entity<T>[] | Collection<T>;
    onChange?: (item: CollectionAdapter<T>, target: CollectionEntityAdapter<T> | null) => void;
    debounce?: number;
}

/**
 * Class representing a Collection Entity Adapter.
 * @implements {IEntityAdapter<T>}
 */
export class CollectionEntityAdapter<T extends IEntity = any> implements IEntityAdapter<T> {
    /**
     * Function that returns a promise that resolves when listeners are present or if the instance is disposed.
     *
     * @returns A promise that resolves to true if the instance is disposed, or false if listeners are present.
     * @throws {Error} If any error occurs during the process.
     */
    private _waitForListeners = () => new Promise<boolean>(async (res, rej) => {
        let isDisposed = false;
        const cleanup = this._dispose.subscribe((value) => isDisposed = value);
        /** react-18 prevent batching */
        await sleep(0);
        const process = () => {
            try {
                const target = this._collection$.current.findById(this.id);
                if (target.hasListeners || isDisposed) {
                    cleanup();
                    res(isDisposed);
                } else {
                    setTimeout(process, WAIT_FOR_LISTENERS_DELAY);
                }
            } catch (e: any) {
                rej(e)
            }
        };
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
    /**
     * Sets the data for the entity.
     *
     * @async
     * @param data - The data to set. It can be either a partial object of type T or a function that takes the previous data of type T and returns
     * a partial object of type T.
     * @returns - A promise that resolves when the data is set.
     * @throws {EntityNotFoundError} - If the entity (with the given ID) is not found in the collection.
     */
    public setData = async (data: Partial<T> | ((prevData: T) => Partial<T>)) => {
        try {
            await this._waitForListeners().then((isDisposed) => {
                const entity = this._collection$.current.findById(this.id);
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
    /**
     * Refreshes the entity asynchronously.
     *
     * @returns A Promise that resolves once the entity is refreshed.
     * @throws {Error} If an error occurs while refreshing the entity.
     */
    public refresh = async () => {
        try {
            await this._waitForListeners().then((isDisposed) => {
                const entity = this._collection$.current.findById(this.id);
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
    /**
     * Converts the current object to a plain JavaScript object.
     *
     * @memberOf [variable name]
     *
     * @throws {Error} If the entity is not found in the collection.
     *
     * @return A plain JavaScript object representing the current entity.
     */
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
    /**
     * Retrieves the entity with the specified ID from the current collection.
     *
     * @throws {Error} If the entity is not found in the collection.
     *
     * @returns The entity with the specified ID.
     */
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

/**
 * CollectionAdapter class is used to adapt a collection of entities.
 * It provides various methods for manipulating and accessing the collection.
 * @typeparam T - The type of entity in the collection
 */
export class CollectionAdapter<T extends IEntity = any> implements ICollectionAdapter<T> {
    /**
     * Waits for any listeners on a collection. Returns a promise that resolves when listeners are present or when the collection is disposed.
     *
     * @returns A promise that resolves with a boolean indicating if the collection is disposed.
     */
    private _waitForListeners = () => new Promise<boolean>(async (res) => {
        let isDisposed = false;
        const cleanup = this._dispose.subscribe((value) => isDisposed = value);
        /** react-18 prevent batching */
        await sleep(0);
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
    /**
     * Constructor for creating an instance of the class.
     *
     * @param _collection$ - The mutable reference object for the collection.
     * @param _dispose - The subject used for disposing.
     */
    constructor(private _collection$: React.MutableRefObject<Collection<T>>, private _dispose: Subject<true>) { }
    /**
     * Retrieves the IDs from the current collection.
     *
     * @returns The IDs from the current collection.
     */
    get ids() {
        return this._collection$.current.ids;
    };
    /**
     * Returns the last index from the current collection.
     * @return The last index of the current collection.
     */
    get lastIdx() {
        return this._collection$.current.lastIdx;
    };
    /**
     * Retrieve the items from the current collection.
     *
     * @return An array of CollectionEntityAdapter instances.
     */
    get items() {
        return this._collection$.current.items
            .map(({ id }) => new CollectionEntityAdapter(id, this._collection$, this._dispose));
    };
    /**
     * Checks if the collection is empty.
     *
     * @function
     * @returns - True if the collection is empty, otherwise false.
     */
    get isEmpty() {
        return this._collection$.current.isEmpty;
    };
    /**
     * Sets new data for the collection.
     *
     * @param items - The new collection data.
     * @returns - A promise that resolves when the new data is set.
     */
    setData = async (items: T[]) => {
        await this._waitForListeners().then((isDisposed) => {
            if (isDisposed) {
                return;
            }
            this._collection$.current.setData(items);
        });
    };
    /**
     * Refreshes the current collection after waiting for listeners.
     *
     * @async
     * @function
     * @returns A promise that resolves after the collection is refreshed.
     */
    refresh = async () => {
        await this._waitForListeners().then((isDisposed) => {
            if (isDisposed) {
                return;
            }
            this._collection$.current.refresh();
        });
    };
    /**
     * Clears the collection.
     * @async
     * @function
     * @returns
     */
    clear = async () => {
        await this._waitForListeners().then((isDisposed) => {
            if (isDisposed) {
                return;
            }
            this._collection$.current.clear();
        });
    };
    /**
     * Asynchronously pushes item(s) to the collection.
     *
     * @param items - The item(s) to push.
     * @returns A Promise that resolves once the item(s) are pushed to the collection.
     */
    push = async (...items: (T[] | T[][])) => {
        await this._waitForListeners().then((isDisposed) => {
            if (isDisposed) {
                return;
            }
            this._collection$.current.push(...items);
        });
    };
    /**
     * Upserts one or more items into the current collection.
     *
     * @param items - One or more items to upsert into the collection.
     *
     * @returns - A Promise that resolves when the upsert operation is complete.
     */
    upsert = async (...items: (T[] | T[][])) => {
        await this._waitForListeners().then((isDisposed) => {
            if (isDisposed) {
                return;
            }
            this._collection$.current.upsert(...items);
        });
    };
    /**
     * Removes an entity from the collection.
     *
     * @param entity - The entity to be removed from the collection.
     * @returns - A Promise that resolves when the entity is successfully removed.
     */
    remove = async (entity: IEntity) => {
        await this._waitForListeners().then((isDisposed) => {
            if (isDisposed) {
                return;
            }
            this._collection$.current.remove(entity);
        });
    };
    /**
     * Removes an item from the collection by its ID.
     *
     * @async
     * @param id - The ID of the item to remove.
     * @returns A promise that resolves with no value.
     */
    removeById = async (id: string | number) => {
        await this._waitForListeners().then((isDisposed) => {
            if (isDisposed) {
                return;
            }
            this._collection$.current.removeById(id);
        });
    };
    /**
     * Removes all items from the collection.
     *
     * @async
     * @function removeAll
     * @instance
     *
     * @returns A promise that resolves once all items are removed.
     */
    removeAll = async () => {
        await this._waitForListeners().then((isDisposed) => {
            if (isDisposed) {
                return;
            }
            this._collection$.current.removeAll();
        });
    };
    /**
     * Finds an entity by its ID in the current collection.
     *
     * @param id - The ID of the entity to be found.
     * @returns - An instance of CollectionEntityAdapter representing the found entity.
     */
    findById = (id: string | number) => {
        const entity = this._collection$.current.findById(id);
        return new CollectionEntityAdapter(entity.id, this._collection$, this._dispose);
    };
    /**
     * Checks if any element of the collection satisfies the provided testing function.
     *
     * @param fn - The testing function to apply to each element of the collection.
     *                       It should take two arguments: the current element of the collection
     *                       and its index. Returns a boolean value indicating whether the element
     *                       satisfies the testing condition.
     * @returns - A boolean value indicating whether any element of the collection satisfies
     *                     the testing function.
     */
    some = (fn: (value: CollectionEntityAdapter<T>, idx: number) => boolean) => {
        return this.items.some(fn);
    };
    /**
     * Performs a given function on each element of the collection.
     *
     * @param fn - The function to be executed on each element.
     *        The function should take two parameters: the current value in the collection
     *        and the index of the current value.
     */
    forEach = (fn: (value: CollectionEntityAdapter<T>, idx: number) => void) => {
        this.items.forEach(fn);
    };
    /**
     * Finds the first element in the collection that satisfies the given condition.
     *
     * @param fn - The condition to be satisfied.
     * @return - The first element that satisfies the condition, or undefined if no element satisfies the condition.
     */
    find = (fn: (value: CollectionEntityAdapter<T>, idx: number) => boolean) => {
        return this.items.find(fn);
    };
    /**
     * Filters the items in the collection based on the provided function.
     *
     * @param fn - A function used to filter the collection items.
     *   The function should accept two parameters: value and idx.
     *   - value: The current item being processed in the collection.
     *   - idx: The index of the current item being processed in the collection.
     *
     * @returns - An array containing the filtered items from the collection.
     */
    filter = (fn: (value: CollectionEntityAdapter<T>, idx: number) => boolean) => {
        return this.items.filter(fn);
    };
    /**
     * Maps over the items in the collection and returns an array of values.
     *
     * @template V - The type of the mapped values.
     * @param fn - The mapping function.
     * @returns - An array of values obtained by applying the mapping function to each item.
     */
    map = <V extends any = any>(fn: (value: CollectionEntityAdapter<T>, idx: number) => V) => {
        return this.items.map<V>(fn);
    };
    /**
     * Retrieves an array representation of the current collection.
     *
     * @returns - An array representation of the current collection.
     */
    toArray = () => this._collection$.current.toArray();
    /**
     * Retrieve the current value of the collection.
     *
     * @returns The current value of the collection.
     */
    toCollection = () => this._collection$.current;
};

/**
 * A custom hook that provides a collection management functionality.
 *
 * @template T - The type of entities in the collection.
 * @param [initialValue=[]] - The initial value of the collection.
 * @param [onChange=() => null] - A callback function to execute when the collection changes.
 * @param [debounce=CHANGE_DEBOUNCE] - The debounce duration in milliseconds for the collection changes.
 * @returns - A memoized instance of the CollectionAdapter class.
 */
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
            collection$.current = newCollection;
            // flushSync(() => {
                setCollection(newCollection);
            // })
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
