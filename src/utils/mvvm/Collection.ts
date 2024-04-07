// import { makeObservable } from 'mobx';
// import { observable, computed, action } from 'mobx';

import EventEmitter from '../rx/EventEmitter';
import Subject from '../rx/Subject';

import debounce from '../hof/debounce';

import Entity, { IEntity, CHANGE_SYMBOL, CHANGE_DEBOUNCE, REFRESH_SYMBOL, IEntityAdapter } from './Entity';

export const REORDER_SYMBOL = Symbol('reorder');

/**
 * An interface representing a collection adapter.
 * @template T - The type of entities in the collection.
 */
export interface ICollectionAdapter<T extends IEntity = any> {
    /**
     * Represents an array of IEntityAdapter objects.
     *
     * @template T - The type of entities that the adapters handle.
     */
    items: IEntityAdapter<T>[];
    /**
     * Represents the last index of an array or string.
     *
     * @type {number}
     */
    lastIdx: number;
    /**
     * Represents an array of entity IDs.
     *
     * @typedef {Array<string | number>} IEntityIds
     */
    ids: IEntity['id'][];
    /**
     * Checks if a value is empty or not.
     *
     * @param value - The value to check if it is empty.
     * @returns - True if the value is empty, otherwise false.
     */
    isEmpty: boolean;
    /**
     * Sets the data for the items.
     *
     * @param items - An array of items to be set as the data.
     * @return {void}
     */
    setData(items: T[]): void;
    /**
     * Applies a mapping function to each value of an entity adapter and returns an array of the mapped values.
     *
     * @template V - The type of values in the resulting array.
     * @param callbackfn - The mapping function to be applied to each value.
     *                    It takes two arguments: the value itself and its index in the entity adapter.
     * @returns An array containing the mapped values.
     */
    map<V = any>(callbackfn: (value: IEntityAdapter<T>, idx: number) => V): V[];
    /**
     * Filters an array of IEntityAdapter<T> objects based on a provided predicate function.
     *
     * @param predicate - The predicate function used to test each IEntityAdapter<T> object.
     *                              The function should accept two arguments:
     *                              - value: The current IEntityAdapter<T> object being processed.
     *                              - idx: The index of the current IEntityAdapter<T> object being processed.
     *                              The predicate function should return a boolean value indicating whether to include the entity in the filtered array.
     * @returns - An array of IEntityAdapter<T> objects that satisfy the provided predicate.
     */
    filter(predicate: (value: IEntityAdapter<T>, idx: number) => boolean): IEntityAdapter<T>[];
    /**
     * Finds the first element in the IEntityAdapter array that satisfies the provided testing function.
     *
     * @param predicate - The testing function that determines whether the element is found or not.
     *                              It should accept two parameters: value (IEntityAdapter<T>) and idx (number).
     * @returns - The first element that satisfies the testing function, or undefined if no such element is found.
     */
    find(predicate: (value: IEntityAdapter<T>, idx: number) => boolean): IEntityAdapter<T> | undefined;
    /**
     * Checks if any of the elements in the array satisfies the provided predicate.
     *
     * @param predicate - The predicate function to be executed for each element in the array.
     *        It takes two parameters:
     *          - value: The current element being processed.
     *          - idx: The index of the current element being processed.
     *        The function should return a boolean value indicating whether the element satisfies the condition.
     *
     * @return {boolean} - Returns true if at least one element satisfies the predicate, otherwise returns false.
     */
    some(predicate: (value: IEntityAdapter<T>, idx: number) => boolean): boolean;
    /**
     * Executes a provided function once for each entity in the adapter.
     *
     * @param callbackfn - The function to execute for each entity. It accepts two arguments: the current entity value and the index
     * of the entity in the adapter.
     * @return {void}
     */
    forEach(callbackfn: (value: IEntityAdapter<T>, idx: number) => void): void;
    /**
     * Pushes one or more items onto the end of the array.
     *
     * @param items - The items to push onto the array.
     * @return {void}
     */
    push(...items: (T[] | T[][])): void;
    /**
     * Upserts the given items into the database.
     *
     * @param items - The items to be upserted. Can be a single array or an array of arrays.
     */
    upsert(...items: (T[] | T[][])): void;
    /**
     * Removes the specified item from the collection.
     *
     * @param item - The item to be removed from the collection.
     * @return {void}
     */
    remove(item: IEntity): void;
    /**
     * Removes an entity from the collection by its id.
     *
     * @param id - The id of the entity to be removed.
     * @return {void}
     */
    removeById(id: IEntity['id']): void;
    /**
     * Removes all elements from the collection.
     *
     * @return {void}
     */
    removeAll(): void;
    /**
     * Finds an entity by its ID.
     *
     * @param id - The ID of the entity to find.
     * @returns - The entity adapter containing the found entity, if any.
     */
    findById(id: IEntity['id']): IEntityAdapter<T>;
    /**
     * Clears the data of the object.
     *
     * @returns
     */
    clear(): void;
    /**
     * Refreshes the content of the page.
     *
     * @return {void} This method has no return value.
     */
    refresh(): void;
    /**
     * Converts the collection into an array.
     *
     * @return {T[]} An array containing the elements of the collection.
     */
    toArray(): T[];
}

export class EntityNotFoundError extends Error {
};

/**
 * @description MVVM Array wrapper. Emmits `change` after push/pop/change of element
 */
export class Collection<T extends IEntity = any> extends EventEmitter implements ICollectionAdapter<T> {

    private readonly _items = new Map<number, Entity<T>>();
    private readonly _ids = new Map<IEntity['id'], number>();

    private _dropChanges = new Subject<void>();

    /**
     * Retrieves the items stored in the current instance.
     *
     * @returns The array of items stored in the current instance.
     */
    public get items(): Entity<T>[] {
        return [...this._items.entries()]
            .sort(([a], [b]) => Number(a) - Number(b))
            .map((value) => value[1]);
    };

    /**
     * Returns the last index of the items in the object.
     *
     * @return The last index of the items.
     */
    get lastIdx() {
        return Math.max(...this._items.keys(), -1) + 1;
    };

    /**
     * Returns an array of all the IDs stored in the object.
     *
     * @returns An array containing all the IDs stored in the object.
     */
    public get ids() {
        return [...this._ids.keys()];
    };

    /**
     * Function to get previous entity data.
     *
     * @param initialData - The initial data to find previous entity.
     * @returns - Function that returns the previous entity data.
     */
    private _prevEntity = (initialData: T) => (): T => {
        const items = this._prevData();
        const prevEntity = items.find((item) => item.id === initialData.id);
        if (prevEntity) {
            return prevEntity.data;
        } else {
            return initialData;
        }
    };

    /**
     * Emits a change event with the provided target entity.
     *
     * @param target - The target entity to be emitted with the change event.
     */
    private _change = (target: Entity<T>) => {
        this.emit(CHANGE_SYMBOL, this, target);
    };

    /**
     * Refreshes the specified target entity.
     *
     * @param target - The entity to be refreshed.
     * @returns
     *
     * @memberOf SomeClass
     */
    private _refresh = (target: Entity<T>) => {
        this.emit(REFRESH_SYMBOL, this, target);
    };

    /**
     * Reorders the items.
     *
     * @function
     * @memberOf SomeClass
     * @name _reorder
     *
     * @returns
     *
     * @description
     * This function triggers an event to reorder the items.
     * It emits the 'REORDER_SYMBOL' event with 'this' as the first parameter and 'null' as the second parameter.
     */
    private _reorder = () => {
        this.emit(REORDER_SYMBOL, this, null);
    };

    /**
     * Dispose function to unsubscribe from all events and clear item and ID collections.
     */
    private _dispose = () => {
        for (const entity of this._items.values()) {
            entity.unsubscribe(CHANGE_SYMBOL, this._change);
            entity.unsubscribe(REFRESH_SYMBOL, this._refresh);
        }
        this._items.clear();
        this._ids.clear();
    };

    /**
     * Constructor for the Collection class.
     * Initializes a new instance of Collection with the given entities and optional debounce value and prevData function.
     *
     * @param entities - The initial entities for the Collection.
     *     It can be an array of entities, a function that returns an array of entities, an array of Entity objects,
     *     or an instance of Collection.
     * @param [_debounce=CHANGE_DEBOUNCE] - Optional debounce value for entity changes.
     * @param [_prevData=() => this.items] - Optional function that returns the previous data of the Collection items.
     * @return
     */
    constructor(entities: T[] | (() => T[]) | Entity<T>[] | Collection<T> = [], protected _debounce = CHANGE_DEBOUNCE, protected _prevData = () => this.items) {
        super();
        if (entities instanceof Collection) {
            const { items } = entities;
            entities._dispose();
            entities = items;
        } else if (typeof entities === 'function') {
            entities = entities().map((data) => new Entity<T>(data, this._debounce, this._prevEntity(data)));
        } else {
            entities = entities.map((e) => {
                if (e instanceof Entity) {
                    e = e.data;
                }
                return new Entity<T>(e, this._debounce, this._prevEntity(e));
            });
        }
        entities.forEach((entity, idx) => {
            this._items.set(idx, entity);
            this._ids.set(entity.id, idx);
            entity.subscribe(CHANGE_SYMBOL, this._change);
            entity.subscribe(REFRESH_SYMBOL, this._refresh);
        });
        /*makeObservable(this, {
            _items: observable,
            items: computed,
            isEmpty: computed,
            setData: action('Collection setData'),
            setRawData: action('Collection setRawData'),
            clear: action('Collection clear'),
            push: action('Collection push'),
            remove: action('Collection remove'),
            removeById: action('Collection removeById'),
        });*/
    };

    /**
     * Checks if the collection is empty.
     *
     * @returns - True if the collection is empty, false otherwise.
     */
    public get isEmpty() {
        return this._items.size === 0;
    };

    /**
     * Sets the data for the software and performs necessary operations.
     *
     * @param items - The array of items to set as data.
     * @returns
     */
    public setData = (items: T[]) => {
        this._dispose();
        for (let i = 0; i !== items.length; i++) {
            const item = items[i];
            const entity = new Entity<T>(item, this._debounce, this._prevEntity(item));
            this._items.set(i, entity);
            this._ids.set(entity.id, i);
            entity.subscribe(CHANGE_SYMBOL, this._change);
            entity.subscribe(REFRESH_SYMBOL, this._refresh);
        };
        this._reorder();
    };

    /**
     * Clear function that performs the following operations:
     * 1. Disposes of any resources held by this class.
     * 2. Reorders any elements as necessary.
     *
     * @function
     * @name clear
     * @memberof global
     * @returns
     */
    public clear = () => {
        this._dispose();
        this._reorder();
    };

    /**
     * Applies a callback function to each value in the map and returns a new array of the results.
     *
     * @template V - The type of the elements in the resulting array.
     * @param callbackfn - A function that accepts a value and its index, and returns a new value.
     * @returns An array containing the results of applying the callback function to each value in the map.
     */
    public map = <V = any>(callbackfn: (value: Entity<T>, idx: number) => V) => {
        return this.items.map(callbackfn);
    };

    /**
     * Filter method for an array of items.
     *
     * @param predicate - The function used to test each item in the array.
     * @returns - The filtered array of items.
     */
    public filter = (predicate: (value: Entity<T>, idx: number) => boolean) => {
        return this.items.filter(predicate);
    };

    /**
     * Finds an entity in the list of items based on the given predicate.
     *
     * @param predicate - The predicate function used to determine if an entity matches the condition.
     *                              The predicate should accept two parameters: value and idx, representing
     *                              the current entity and its index respectively. It should return a boolean
     *                              value indicating whether the entity matches the condition.
     *
     * @returns - The entity that matches the condition specified by the predicate. If no entity
     *                        matches the condition, undefined is returned.
     */
    public find = (predicate: (value: Entity<T>, idx: number) => boolean) => {
        return this.items.find(predicate);
    };

    /**
     * Checks if at least one element in the array passes the provided test.
     *
     * @param predicate - The test function used to check each element.
     * @param predicate.value - The current element being checked.
     * @param predicate.idx - The index of the current element being checked.
     * @returns - True if any element passes the test, false otherwise.
     */
    public some = (predicate: (value: Entity<T>, idx: number) => boolean) => {
        return this.items.some(predicate);
    };

    /**
     * Calls a function for each element in the array and passes the value and index as arguments.
     *
     * @param callbackfn - The function to call for each element, accepts the value and index as arguments.
     */
    public forEach = (callbackfn: (value: Entity<T>, idx: number) => void) => {
        return this.items.forEach(callbackfn);
    };

    /**
     * Adds items to the collection and performs necessary operations.
     *
     * @param items - The items to be added to the collection.
     */
    public push = (...items: (T[] | T[][])) => {
        const itemList = items.flat() as T[];
        const lastIdx = this.lastIdx;
        for (let i = 0; i !== itemList.length; i++) {
            const pendingIdx = lastIdx + i;
            const item = itemList[i];
            if (item.id === undefined) {
                item.id = pendingIdx;
            }
            const entity = new Entity<T>(item, this._debounce, this._prevEntity(item));
            this._items.set(pendingIdx, entity);
            this._ids.set(entity.id, pendingIdx);
            entity.subscribe(CHANGE_SYMBOL, this._change);
            entity.subscribe(REFRESH_SYMBOL, this._refresh);
        }
        this._reorder();
    };

    /**
     * Upsert function for adding or updating items in a collection.
     *
     * @param items - An array of items to be added or updated.
     */
    public upsert = (...items: T[] | T[][]) => {
        const itemList = items.flat() as T[];
        const itemMap = new Map(itemList.map((item) => [item.id, item]));
        const updateSet = new Set<T["id"]>();
        for (const currentItem of this._items.values()) {
            const pendingItem = itemMap.get(currentItem.id);
            if (pendingItem) {
                currentItem.setData(pendingItem);
                updateSet.add(currentItem.id);
            }
        }
        this.push(...itemList.filter(({ id }) => !updateSet.has(id)))
    };

    /**
     * Removes an item from the collection by its ID.
     *
     * @param item - The item to be removed.
     * @returns
     */
    public remove = (item: IEntity) => {
        this.removeById(item.id);
    };

    /**
     * Removes an item from the collection by its id.
     *
     * @param id - The id of the item to be removed.
     * @throws {EntityNotFoundError} If the item with the given id is not found in the collection.
     */
    public removeById = (id: IEntity['id']) => {
        for (const [key, value] of this._items.entries()) {
            if (value.id === id) {
                this._items.delete(key);
                this._ids.delete(id);
                value.unsubscribe(CHANGE_SYMBOL, this._change);
                value.unsubscribe(REFRESH_SYMBOL, this._refresh);
                this._reorder();
                return;
            }
        }
        throw new EntityNotFoundError(`removeById unknown entity id ${id}`);
    };

    /**
     * Removes all items from the collection and performs necessary cleanup.
     *
     * @function
     * @memberof Collection
     * @name removeAll
     * @return
     */
    public removeAll = () => {
        for (const [key, value] of this._items.entries()) {
            this._items.delete(key);
            this._ids.delete(value.id);
            value.unsubscribe(CHANGE_SYMBOL, this._change);
            value.unsubscribe(REFRESH_SYMBOL, this._refresh);
        }
        this._reorder();
    };

    /**
     * Finds an entity by its ID.
     *
     * @param id - The ID of the entity to find.
     * @returns - The found entity.
     * @throws {EntityNotFoundError} - If the entity with the given ID does not exist.
     */
    public findById = (id: IEntity['id']) => {
        if (this._ids.has(id)) {
            const idx = this._ids.get(id)!;
            return this._items.get(idx)!;
        }
        throw new EntityNotFoundError(`findById unknown entity id ${id}`);
    };

    /**
     * Attaches a change handler to the given collection.
     *
     * @param change - The function to be called when a change occurs in the collection.
     *                           It should accept two parameters:
     *                             - collection: The collection that has changed.
     *                             - target: The entity that has been modified, or null if the entire collection has changed.
     * @returns - A function that can be called to detach the change handler from the collection.
     */
    public handleChange = (change: (collection: Collection<T>, target: Entity<T> | null) => void) => {
        const fn = debounce(change, this._debounce);
        const drop = this._dropChanges.subscribe(fn.clear);
        this.subscribe(CHANGE_SYMBOL, fn);
        this.subscribe(REFRESH_SYMBOL, change);
        this.subscribe(REORDER_SYMBOL, change);
        return () => {
            this.unsubscribe(CHANGE_SYMBOL, fn);
            this.unsubscribe(REFRESH_SYMBOL, change);
            this.unsubscribe(REORDER_SYMBOL, change);
            fn.clear();
            drop();
        };
    };

    /**
     * Handles drop changes for all entities in the collection.
     * Triggers the drop changes event after processing.
     *
     * @memberof ClassName
     * @function handleDropChanges
     * @returns
     */
    public handleDropChanges = () => {
        for (const entity of this._items.values()) {
            entity.handleDropChanges();
        }
        this._dropChanges.next();
    };

    /**
     * Executes a refresh action triggering an event.
     *
     * @function refresh
     * @instance
     *
     * @emits REFRESH_SYMBOL
     */
    public refresh = () => this.emit(REFRESH_SYMBOL, this, null);

    /**
     * Converts an array of objects to an array of plain objects using the "toObject" method of each object.
     *
     * @returns The new array with each object converted to a plain object.
     */
    public toArray = () => this.map((item) => item.toObject());

};

export default Collection;
