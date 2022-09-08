import { makeObservable } from 'mobx';
import { observable, computed, action } from 'mobx';

import EventEmitter from '../rx/EventEmitter';
import debounce from '../hof/debounce';

export interface IEntity {
    id: string | number;
}

export const CHANGE_SYMBOL = Symbol('change');
export const CHANGE_DEBOUNCE = 1_000;

/**
 * @description MVVM Object wrapper. Emmits change after setData
 */
export class Entity<T extends IEntity = any> extends EventEmitter {

    get id() {
        return this._data.id;
    };

    get data(): T {
        return { ...this._data };
    };

    constructor(public _data: T) {
        super();
        makeObservable(this, {
            _data: observable,
            data: computed,
            id: computed,
            setData: action('Entity setData'),
        });
    };

    setData = (data: T) => {
        this._data = data;
        this.emit(CHANGE_SYMBOL, this);
    };

    handleChange = (change: (item: Entity<T>) => void) => {
        const fn = debounce(change, CHANGE_DEBOUNCE);
        this.subscribe(CHANGE_SYMBOL, fn);
        return () => {
            this.unsubscribe(CHANGE_SYMBOL, fn);
            fn.clear();
        };
    };

};

export default Entity;
