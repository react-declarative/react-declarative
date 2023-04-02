import EventEmitter from "./EventEmitter";

import TObserver, { TObservable } from "../../model/TObserver";

import compose from '../compose';
import queued from "../hof/queued";
import debounce from "../hof/debounce";

const OBSERVER_EVENT = Symbol('observer-subscribe');
const CONNECT_EVENT = Symbol('observer-connect');
const DISCONNECT_EVENT = Symbol('observer-disconnect');

export const LISTEN_CONNECT = Symbol('observer-connect-listen');
export const LISTEN_DISCONNECT = Symbol('observer-disconnect-listen');

type Fn = (...args: any[]) => void;

export class Observer<Data = any> implements TObserver<Data> {

    private readonly broadcast = new EventEmitter();
    private _isShared = false;

    public get isShared() {
        return this._isShared;
    };

    constructor(private readonly dispose: Fn) { }

    [LISTEN_CONNECT](fn: () => void) {
        this.broadcast.once(CONNECT_EVENT, fn);
    };

    [LISTEN_DISCONNECT](fn: () => void) {
        this.broadcast.once(DISCONNECT_EVENT, fn);
    };

    private _subscribe = (callback: Fn) => {
        this.broadcast.subscribe(OBSERVER_EVENT, callback);
        this.broadcast.emit(CONNECT_EVENT);
    };

    private _unsubscribe = (callback: Fn) => {
        this.broadcast.unsubscribe(OBSERVER_EVENT, callback);
        this.broadcast.emit(DISCONNECT_EVENT);
    };

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
        this._subscribe(handler);
        unsubscribeRef = () => this._unsubscribe(handler);
        return observer;
    };

    public mapAsync = <T = any>(callbackfn: (value: Data) => Promise<T>, fallbackfn?: (e: Error) => void): Observer<T> => {
        let unsubscribeRef: Fn;
        const dispose = compose(
            () => this.tryDispose(),
            () => unsubscribeRef(),
        );
        const observer = new Observer<T>(dispose);
        const iteraction = queued(callbackfn);
        const handler = async (value: Data) => {
            try {
                const pendingValue = await iteraction(value);
                observer.emit(pendingValue);
            } catch (e: any) {
                if (fallbackfn) {
                    fallbackfn(e);
                } else {
                    throw e;
                }
            }
        };
        this._subscribe(handler);
        unsubscribeRef = compose(
            () => this._unsubscribe(handler),
            () => iteraction.clear(),
        );
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
        this._subscribe(handler);
        unsubscribeRef = () => this._unsubscribe(handler);
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
        this._subscribe(handler);
        unsubscribeRef = () => this._unsubscribe(handler);
        return observer;
    };

    public debounce = (delay?: number): Observer<Data> => {
        let unsubscribeRef: Fn;
        const dispose = compose(
            () => this.tryDispose(),
            () => unsubscribeRef(),
        );
        const observer = new Observer<Data>(dispose);
        const handler = debounce((value: Data) => {
            observer.emit(value);
        }, delay);
        this._subscribe(handler);
        unsubscribeRef = compose(
            () => handler.clear(),
            () => this._unsubscribe(handler),
        );
        return observer;
    };

    public emit = (data: Data) => {
        this.broadcast.emit(OBSERVER_EVENT, data);
    };

    public connect = (callbackfn: (value: Data) => void) => { 
        this._subscribe(callbackfn);
        return compose(
            () => this.tryDispose(),
            () => this._unsubscribe(callbackfn),
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
        this._subscribe(handler);
        const subscription = observer.tap(handler);
        unsubscribeRef = compose(
            () => this._unsubscribe(handler),
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
