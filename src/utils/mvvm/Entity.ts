// import { makeObservable } from 'mobx';
// import { observable, computed, action } from 'mobx';

import EventEmitter from '../rx/EventEmitter';
import debounce from '../hof/debounce';

export interface IEntity {
    id: string | number;
}

export const CHANGE_SYMBOL = Symbol('change');
export const CHANGE_DEBOUNCE = 500;

/**
 * @description MVVM Object wrapper. Emmits change after setData
 */
export class Entity<T extends IEntity = any> extends EventEmitter {

    private _data: T;

    get id() {
        return this._data.id;
    };

    get data(): T {
        return { ...this._data };
    };

    private _change = () => {
        this.emit(CHANGE_SYMBOL, this);
    };

    constructor(_data: T | Entity<T>) {
        super();
        if (_data instanceof Entity) {
            this._data = _data.data;
        } else {
            this._data = _data;
        }
        /*makeObservable(this, {
            _data: observable,
            data: computed,
            id: computed,
            setData: action('Entity setData'),
        });*/
    };

    setData = (data: T) => {
        this._data = {
            ...data,
            id: this.id,
        };
        this._change();
    };

    handleChange = (change: (item: Entity<T>) => void) => {
        const fn = debounce(change, CHANGE_DEBOUNCE);
        this.subscribe(CHANGE_SYMBOL, fn);
        return () => {
            this.unsubscribe(CHANGE_SYMBOL, fn);
            fn.clear();
        };
    };

    toObject = () => this.data;

};

export default Entity;
