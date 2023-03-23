import EventEmitter from "./EventEmitter";

import TObserver, { TObservable } from "../../model/TObserver";

import compose from '../compose';

export const OBSERVER_EVENT = Symbol('react-declarative-observer');

type Fn = (...args: any[]) => void;

export class Observer<Data = any> implements TObserver<Data> {

    private readonly broadcast = new EventEmitter();
    private _isShared = false;

    public get isShared() {
        return this._isShared;
    };

    constructor(private readonly dispose: Fn) { }

    private tryDispose =  () => {
        if (!this.broadcast.hasListeners && !this._isShared) {
            this.dispose();
        }
    };

    public map = <T = any>(callbackfn: (value: Data) => T): Observer<T> => {
        let unsubscribeRef: Fn;
        const dispose = compose(
            () => this.tryDispose(),
            () => unsubscribeRef(),
        );
        const observer = new Observer<T>(dispose);
        const handler = (value: Data) => {
            const pendingValue = callbackfn(value);
            observer.emit(pendingValue);
        };
        this.broadcast.subscribe(OBSERVER_EVENT, handler);
        unsubscribeRef = () => this.broadcast.unsubscribe(OBSERVER_EVENT, handler);
        return observer;
    };

    public mapAsync = <T = any>(callbackfn: (value: Data) => Promise<T>, fallbackfn?: (e: Error) => void): Observer<T> => {
        let unsubscribeRef: Fn;
        const dispose = compose(
            () => this.tryDispose(),
            () => unsubscribeRef(),
        );
        const observer = new Observer<T>(dispose);
        const handler = async (value: Data) => {
            try {
                const pendingValue = await callbackfn(value);
                observer.emit(pendingValue);
            } catch (e: any) {
                if (fallbackfn) {
                    fallbackfn(e);
                } else {
                    throw e;
                }
            }
        };
        this.broadcast.subscribe(OBSERVER_EVENT, handler);
        unsubscribeRef = () => this.broadcast.unsubscribe(OBSERVER_EVENT, handler);
        return observer;
    };

    public filter = (callbackfn: (value: Data) => boolean): Observer<Data> => {
        let unsubscribeRef: Fn;
        const dispose = compose(
            () => this.tryDispose(),
            () => unsubscribeRef(),
        );
        const observer = new Observer<Data>(dispose);
        const handler = (value: Data) => {
            const delegate = callbackfn(value);
            if (delegate) {
                observer.emit(value);
            }
        };
        this.broadcast.subscribe(OBSERVER_EVENT, handler);
        unsubscribeRef = () => this.broadcast.unsubscribe(OBSERVER_EVENT, handler);
        return observer;
    };

    public tap = (callbackfn: (value: Data) => void): Observer<Data> => {
        let unsubscribeRef: Fn;
        const dispose = compose(
            () => this.tryDispose(),
            () => unsubscribeRef(),
        );
        const observer = new Observer<Data>(dispose);
        const handler = (value: Data) => {
            callbackfn(value);
            observer.emit(value);
        };
        this.broadcast.subscribe(OBSERVER_EVENT, handler);
        unsubscribeRef = () => this.broadcast.unsubscribe(OBSERVER_EVENT, handler);
        return observer;
    };

    public emit = (data: Data) => {
        this.broadcast.emit(OBSERVER_EVENT, data);
    };

    public connect = (callbackfn: (value: Data) => void) => { 
        this.broadcast.subscribe(OBSERVER_EVENT, callbackfn);
        return compose(
            () => this.tryDispose(),
            () => this.broadcast.unsubscribe(OBSERVER_EVENT, callbackfn),
        );
    };

    public share = () => {
        this._isShared = true;
        return this;
    };

    public merge = <T = any>(observer: TObservable<T>): Observer<Data | T>  => {
        let unsubscribeRef: Fn;
        const dispose = compose(
            () => this.tryDispose(),
            () => unsubscribeRef(),
        );
        const merged = new Observer<Data | T>(dispose);
        const handler = (value: Data | T) => {
            merged.emit(value);
        };
        this.broadcast.subscribe(OBSERVER_EVENT, handler);
        const subscription = observer.tap(handler);
        unsubscribeRef = compose(
            () => this.broadcast.unsubscribe(OBSERVER_EVENT, handler),
            () => subscription.unsubscribe(),
        );
        return merged;
    };

    public unsubscribe = () => {
        this.broadcast.unsubscribeAll();
        this.dispose();
    };
};

export { TObserver };

export default Observer;
