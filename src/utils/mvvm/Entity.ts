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
    /**
     * An identifier representing the unique identity of an entity.
     *
     * @typedef IEntityId
     */
    id: IEntity['id'];
    /**
     * Sets the data for the given object.
     *
     * @param data - The data to be set. It can be either a partial object of type T or a function that takes the previous data of type T as
     * input and returns a partial object of type T.
     * @returns
     */
    setData(data: Partial<T> | ((prevData: T) => Partial<T>)): void;

    /**
     * Represents a variable of type T.
     *
     * @typeparam T - The type of data stored in the variable.
     */
    data: T;
    /**
     * Refreshes the view or data associated with the current state.
     * This method internally handles the logic to update the view or fetch the latest data
     * based on the current state of the application.
     * Note that this method does not return any value.
     *
     * @function
     * @name refresh
     * @returns
     */
    refresh(): void;
    /**
     * Converts the current object to its corresponding type T.
     *
     * @returns The converted object of type T.
     */
    toObject(): T;
};

/**
 * @description MVVM Object wrapper. Emmits change after setData
 */
export class Entity<T extends IEntity = any> extends Model<T> implements IEntityAdapter<T> {

    /**
     * Retrieves the id value from the data object.
     *
     * @returns The id value.
     */
    public get id() {
        return this._data.id;
    };

    constructor(_data: T | Entity<T> | (() => T), _debounce = CHANGE_DEBOUNCE, _prevData = () => this._data) {
        super(_data, _debounce, _prevData);
    };

    /**
     * Sets the data for the given variable.
     *
     * @param data - The data to be set.
     *    This can either be a partial object of type T or a function that takes the previous data
     *    of type T and returns a partial object of type T.
     *
     * @returns
     */
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

    /**
     * Handles change events.
     *
     * @param change - The change event handler function.
     * @returns - The function to unregister the change event.
     */
    public handleChange = (change: (item: Entity<T>) => void): () => void => {
        return super.handleChange(change as (item: Model<T>) => void);
    };

};

export default Entity;
