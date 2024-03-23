import EventEmitter from "../rx/EventEmitter";
import Subject from "../rx/Subject";

import debounce from '../hof/debounce';

export const CHANGE_SYMBOL = Symbol('change');
export const REFRESH_SYMBOL = Symbol('refresh');
export const CHANGE_DEBOUNCE = 1_000;

/**
 * Represents an interface for a model adapter.
 * @template T The type of data that the adapter handles.
 */
export interface IModelAdapter <T extends {} = any>  {
    /**
     * Represents a variable of unknown type T.
     *
     * @template T
     */
    data: T;
    /**
     * Sets the data for the object.
     *
     * @param {Partial<T> | ((prevData: T) => Partial<T>)} data - The data to set. It can be a partial object of type T or a function that takes the previous data of type T and returns a
     * partial object of type T.
     * @return {void}
     */
    setData(data: Partial<T> | ((prevData: T) => Partial<T>)): void;
    /**
     * Refreshes the page.
     *
     * @returns {void}
     */
    refresh(): void;
    /**
     * Returns an object representation of the instance.
     *
     * @template T
     * @returns {T} The object representation of the instance.
     */
    toObject(): T;
};

/**
 * Class representing a model.
 * @extends EventEmitter
 * @implements IModelAdapter
 */
export class Model<T extends {} = any> extends EventEmitter implements IModelAdapter<T> {

    protected _dropChanges = new Subject<void>();
    protected _data: T;

    /**
     * Retrieves the value of the data property.
     *
     * @return The frozen data.
     */
    public get data(): T {
        return Object.freeze(this._data);
    };

    /**
     * Triggers the change event.
     *
     * @function _change
     * @instance
     * @name _change
     * @summary Triggers the change event and emits the change symbol.
     * @returns
     */
    private _change = () => {
        this.emit(CHANGE_SYMBOL, this);
    };

    constructor(_data: T | Model<T> | (() => T), protected _debounce = CHANGE_DEBOUNCE, protected _prevData = () => this._data) {
        super();
        if (_data instanceof Model) {
            this._data = _data.data;
        } else if (typeof _data === 'function') {
            this._data = (_data as Function)();
        } else {
            this._data = _data;
        }
        this.setData = this.setData.bind(this);
        this.handleChange = this.handleChange.bind(this);
        /*makeObservable(this, {
            _data: observable,
            data: computed,
            id: computed,
            setData: action('Entity setData'),
        });*/
    };

    /**
     * Sets the data for the object.
     *
     * @param data - The data to be set. It can be a partial object or a function that takes the previous data and returns a partial object.
     *
     * @return
     */
    public setData(data: Partial<T> | ((prevData: T) => Partial<T>)) {
        if (typeof data === 'function') {
            data = data(this._prevData());
        }
        this._data = {
            ...this._data,
            ...data,
        };
        this._change();
    };

    /**
     * Handles changes made to the Model.
     *
     * @param change - The callback function to be executed when a change occurs in the Model.
     *                           It accepts a single parameter representing the changed item of type Model<T>.
     *
     * @return - A cleanup function that unsubscribes the callback from the CHANGE_SYMBOL event,
     *                      unsubscribes the callback from the REFRESH_SYMBOL event, clears the debounce function,
     *                      and unsubscribes the drop function.
     */
    public handleChange(change: (item: Model<T>) => void) {
        const fn = debounce(change, this._debounce);
        const drop = this._dropChanges.subscribe(fn.clear);
        this.subscribe(CHANGE_SYMBOL, fn);
        this.subscribe(REFRESH_SYMBOL, change);
        return () => {
            this.unsubscribe(CHANGE_SYMBOL, fn);
            this.unsubscribe(REFRESH_SYMBOL, change);
            fn.clear();
            drop();
        };
    };

    /**
     * Handles the changes when an item is dropped.
     *
     * @function handleDropChanges
     * @memberof ClassName
     * @returns
     */
    public handleDropChanges = () => {
        this._dropChanges.next();
    };

    /**
     * A function that triggers a refresh event.
     *
     * @function
     * @memberOf global
     * @returns
     */
    public refresh = () => this.emit(REFRESH_SYMBOL, this);

    /**
     * Converts the object into a plain JavaScript object.
     *
     * @function
     * @returns - The plain JavaScript object representation.
     */
    public toObject = () => this.data;

};

export default Model;
