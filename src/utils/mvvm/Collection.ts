// import { makeObservable } from 'mobx';
// import { observable, computed, action } from 'mobx';

import EventEmitter from '../rx/EventEmitter';
import debounce from '../hof/debounce';

import Entity, { IEntity, CHANGE_SYMBOL, CHANGE_DEBOUNCE } from './Entity';

/**
 * @description MVVM Array wrapper. Emmits `change` after push/pop/change of new element
 */
export class Collection<T extends IEntity = any> extends EventEmitter {

    private readonly _items = new Map<number, Entity<T>>();

    get items(): Entity<T>[] {
        return [...this._items.entries()]
            .sort(([a], [b]) => Number(a) - Number(b))
            .map((value) => value[1]);
    };

    private _change = () => {
        this.emit(CHANGE_SYMBOL, this);
    };

    constructor(entities: Entity<T>[] | Collection<T> = []) {
        super();
        if (entities instanceof Collection) {
            entities = entities.items;
        }
        entities.forEach((entity, idx) => {
            this._items.set(idx, entity);
            entity.subscribe(CHANGE_SYMBOL, this._change);
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

    get isEmpty() {
        return this.items.length === 0;
    };

    setData = (items: T[]) => {
        this.clear();
        for (let i = 0; i !== items.length; i++) {
            const item = items[i];
            const entity = new Entity(item);
            this._items.set(i, entity);
            entity.subscribe(CHANGE_SYMBOL, this._change);
        };
        this._change();
    };

    clear = () => {
        for (const entity of this._items.values()) {
            entity.unsubscribe(CHANGE_SYMBOL, this._change);
        }
        this._items.clear();
    };

    map = <V = any>(callbackfn: (value: Entity<T>) => V) => {
        return this.items.map(callbackfn);
    };

    forEach = (callbackfn: (value: Entity<T>) => void) => {
        return this.items.forEach(callbackfn);
    };

    push = (...items: T[]) => {
        const lastId = Math.max(...this._items.keys()) + 1;
        for (let i = 0; i !== items.length; i++) {
            const item = items[i];
            const entity = new Entity(item);
            this._items.set(lastId + i, entity);
            entity.subscribe(CHANGE_SYMBOL, this._change);
        }
        this._change();
    };

    remove = (item: IEntity) => {
        this.removeById(item.id);
    };

    removeById = (id: IEntity['id']) => {
        for (const [key, value] of this._items.entries()) {
            if (value.id === id) {
                this._items.delete(key);
                value.unsubscribe(CHANGE_SYMBOL, this._change);
                this._change();
                return;
            }
        }
        throw new Error(`Unknown entity id ${id}`);
    };

    handleChange = (change: (item: Collection<T>) => void) => {
        const fn = debounce(change, CHANGE_DEBOUNCE);
        this.subscribe(CHANGE_SYMBOL, fn);
        return () => {
            this.unsubscribe(CHANGE_SYMBOL, fn);
            fn.clear();
        };
    };

};

export default Collection;
