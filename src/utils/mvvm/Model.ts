import EventEmitter from "../rx/EventEmitter";

import debounce from '../hof/debounce';

export const CHANGE_SYMBOL = Symbol('change');
export const REFRESH_SYMBOL = Symbol('refresh');
export const CHANGE_DEBOUNCE = 1_000;

export class Model<T extends {} = any> extends EventEmitter {

    protected _data: T;

    public get data(): T {
        return { ...this._data };
    };

    private _change = () => {
        this.emit(CHANGE_SYMBOL, this);
    };

    constructor(_data: T | Model<T> | (() => T)) {
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

    public setData(data: Partial<T>) {
        this._data = {
            ...this._data,
            ...data,
        };
        this._change();
    };

    public handleChange(change: (item: Model<T>) => void) {
        const fn = debounce(change, CHANGE_DEBOUNCE);
        this.subscribe(CHANGE_SYMBOL, fn);
        return () => {
            this.unsubscribe(CHANGE_SYMBOL, fn);
            fn.clear();
        };
    };

    public refresh = () => this.emit(REFRESH_SYMBOL);

    public toObject = () => this.data;

};

export default Model;
