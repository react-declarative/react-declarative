import { makeObservable } from 'mobx';
import { observable, computed, action } from 'mobx';

import EventEmitter from '../rx/EventEmitter';

export interface IEntity {
    id: string | number;
}

export const CHANGE_SYMBOL = Symbol('change');

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
        this.subscribe(CHANGE_SYMBOL, change);
        return () => this.unsubscribe(CHANGE_SYMBOL, change);
    };

};

export default Entity;
