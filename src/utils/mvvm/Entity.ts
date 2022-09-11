// import { makeObservable } from 'mobx';
// import { observable, computed, action } from 'mobx';

import Model from "./Model";

export { CHANGE_DEBOUNCE, CHANGE_SYMBOL, REFRESH_SYMBOL } from './Model';

export interface IEntity {
    id: string | number;
}

/**
 * @description MVVM Object wrapper. Emmits change after setData
 */
export class Entity<T extends IEntity = any> extends Model<T> {

    public get id() {
        return this._data.id;
    };

    constructor(_data: T | Entity<T> | (() => T)) {
        super(_data);
    };

    public setData = (data: Partial<T>) => {
        super.setData({
            ...data,
            id: this.id,
        });
    };

    public handleChange = (change: (item: Entity<T>) => void) => {
        return super.handleChange(change as (item: Model<T>) => void);
    };

};

export default Entity;
