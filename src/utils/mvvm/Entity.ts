// import { makeObservable } from 'mobx';
// import { observable, computed, action } from 'mobx';

import randomString from "../randomString";

import Model, { CHANGE_DEBOUNCE } from "./Model";

export { CHANGE_DEBOUNCE, CHANGE_SYMBOL, REFRESH_SYMBOL } from './Model';

/**
 * Represents an entity with an identifier.
 */
export interface IEntity {
    id: string | number;
}

/**
 * Represents an interface for an entity adapter.
 *
 * @template T - The type of the entity.
 */
export interface IEntityAdapter<T extends IEntity = any> {
    id: IEntity['id'];
    setData(data: Partial<T> | ((prevData: T) => Partial<T>)): void;
    data: T;
    refresh(): void;
    toObject(): T;
};

/**
 * @description MVVM Object wrapper. Emmits change after setData
 */
export class Entity<T extends IEntity = any> extends Model<T> implements IEntityAdapter<T> {

    public get id() {
        return this._data.id;
    };

    constructor(_data: T | Entity<T> | (() => T), _debounce = CHANGE_DEBOUNCE, _prevData = () => this._data) {
        super(_data, _debounce, _prevData);
    };

    public setData = (data: Partial<T> | ((prevData: T) => Partial<T>)) => {
        if (typeof data === 'function') {
            data = data(this._prevData());
        }
        if (data.id === undefined) {
            data.id = randomString();
        }
        super.setData({
            ...data,
        });
    };

    public handleChange = (change: (item: Entity<T>) => void): () => void => {
        return super.handleChange(change as (item: Model<T>) => void);
    };

};

export default Entity;
