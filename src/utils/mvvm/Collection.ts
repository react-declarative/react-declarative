import { makeObservable } from 'mobx';
import { observable, computed, action } from 'mobx';

import EventEmitter from '../rx/EventEmitter';

import Entity, { IEntity, CHANGE_SYMBOL } from './Entity';

/**
 * @description MVVM Array wrapper. Emmits `change` after push/pop/change of new element
 */
export class Collection<T extends IEntity = any> extends EventEmitter {

    public readonly _items = new Map<number, Entity<T>>();

    get items(): Entity<T>[] {
        return [...this._items.entries()]
            .sort(([a], [b]) => Number(a) - Number(b))
            .map((value) => value[1]);
    };

    private _change = () => {
        this.emit(CHANGE_SYMBOL, this);
    };

    constructor(entities: Entity<T>[] = []) {
        super();
        entities.forEach((entity, idx) => {
            this._items.set(idx, entity);
            entity.subscribe(CHANGE_SYMBOL, this._change);
        });
        makeObservable(this, {
            _items: observable,
            items: computed,
            isEmpty: computed,
            setData: action('Collection setData'),
            setRawData: action('Collection setRawData'),
            clear: action('Collection clear'),
            push: action('Collection push'),
            remove: action('Collection remove'),
            removeById: action('Collection removeById'),
        });
    };

    get isEmpty() {
        return this.items.length === 0;
    };

    setData = (entities: Entity<T>[]) => {
        this.clear();
        for (let i = 0; i !== entities.length; i++) {
            const entity = entities[i];
            this._items.set(i, entity);
            entity.subscribe(CHANGE_SYMBOL, this._change);
        };
        this._change();
    };

    setRawData = (items: T[]) => {
        this.setData(items.map((item) => new Entity(item)));
    };

    clear = () => {
        for (const entity of this._items.values()) {
            entity.unsubscribe(CHANGE_SYMBOL, this._change);
        }
        this._items.clear();
    };

    map = <V = any>(callbackfn: (value: Entity<T>) => V) => {
        const map: { [key: number]: V } = {}
        for (const [key, value] of this._items.entries()) {
            map[key] = callbackfn(value);
        }
        return Object.entries(map)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map((value) => value[1]);
    };

    forEach = (callbackfn: (value: Entity<T>) => void) => {
        return Object.entries(this._items)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map((value) => value[1])
            .forEach(callbackfn);
    };

    push = (...entities: Entity<T>[]) => {
        const lastId = Math.max(...this._items.keys()) + 1;
        for (let i = 0; i !== entities.length; i++) {
            const entity = entities[i];
            this._items.set(lastId + i, entity);
            entity.subscribe(CHANGE_SYMBOL, this._change);
        }
        this._change();
    };

    remove = (entity: Entity<T>) => {
        for (const [key, value] of this._items.entries()) {
            if (value.id === entity.id) {
                this._items.delete(key);
                value.unsubscribe(CHANGE_SYMBOL, this._change);
                this._change();
                return;
            }
        }
        throw new Error(`Unknown entity ${entity.id}`);
    };

    removeById = (id: string | number) => {
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
        this.subscribe(CHANGE_SYMBOL, change);
        return () => this.unsubscribe(CHANGE_SYMBOL, change);
    };

};

export default Collection;
