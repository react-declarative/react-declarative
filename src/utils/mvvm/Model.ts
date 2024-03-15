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
    data: T;
    setData(data: Partial<T> | ((prevData: T) => Partial<T>)): void;
    refresh(): void;
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

    public get data(): T {
        return Object.freeze(this._data);
    };

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

    public handleDropChanges = () => {
        this._dropChanges.next();
    };

    public refresh = () => this.emit(REFRESH_SYMBOL, this);

    public toObject = () => this.data;

};

export default Model;
