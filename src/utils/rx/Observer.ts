import EventEmitter from "./EventEmitter";

import TObserver from "../../model/TObserver";

import compose from '../compose';
import queued from "../hof/queued";
import debounce from "../hof/debounce";
import { CANCELED_SYMBOL } from "../hof/cancelable";

const OBSERVER_EVENT = Symbol('observer-subscribe');

const CONNECT_EVENT = Symbol('observer-connect');
const DISCONNECT_EVENT = Symbol('observer-disconnect');

export const LISTEN_CONNECT = Symbol('observer-connect-listen');
export const LISTEN_DISCONNECT = Symbol('observer-disconnect-listen');

type Fn = (...args: any[]) => void;

/**
 * A class representing an Observer.
 *
 * @template Data - The type of data to observe.
 */
export class Observer<Data = any> implements TObserver<Data> {

    private readonly broadcast = new EventEmitter();
    private _isShared = false;

    /**
     * Returns the current value of the 'isShared' property.
     *
     * @returns - The value of the 'isShared' property.
     */
    public get isShared() {
        return this._isShared;
    };

    /**
     * Returns whether the given event has any listeners.
     *
     * @returns True if there are listeners for the event, otherwise false.
     */
    public get hasListeners() {
        return !!this.broadcast.getListeners(OBSERVER_EVENT).length;
    };

    constructor(private readonly dispose: Fn) { }

    /**
     * Sets up a listener for the connect event on the broadcast channel.
     *
     * @param fn - The callback function to be executed once the connect event is triggered.
     * @returns
     */
    [LISTEN_CONNECT](fn: () => void) {
        this.broadcast.once(CONNECT_EVENT, fn);
    };

    /**
     * Adds a listener for the DISCONNECT_EVENT.
     *
     * @param fn - The function to be executed when the event occurs.
     */
    [LISTEN_DISCONNECT](fn: () => void) {
        this.broadcast.once(DISCONNECT_EVENT, fn);
    };

    /**
     * Subscribe a given observer to the global broadcast event.
     *
     * @param observer - The observer subscribing to the event.
     * @param callback - The callback function to be executed when the event is triggered.
     * @returns
     */
    private _subscribe = <T = any>(observer: TObserver<T>, callback: Fn) => {
        this.broadcast.subscribe(OBSERVER_EVENT, callback);
        observer[LISTEN_CONNECT](() => {
            this.broadcast.emit(CONNECT_EVENT);
        });
        observer[LISTEN_DISCONNECT](() => {
            if (!this.hasListeners) {
                this.broadcast.emit(DISCONNECT_EVENT);
            }
        });
    };

    /**
     * Unsubscribes a callback function from the observer event.
     *
     * @param callback - The callback function to unsubscribe.
     * @returns
     */
    private _unsubscribe = (callback: Fn) => {
        this.broadcast.unsubscribe(OBSERVER_EVENT, callback);
    };

    /**
     * Tries to dispose the object if it has no listeners and is not shared.
     * If disposed successfully, emits the DISCONNECT_EVENT.
     */
    private tryDispose =  () => {
        if (!this.hasListeners && !this._isShared) {
            this.dispose();
            this.broadcast.emit(DISCONNECT_EVENT);
        }
    };

    /**
     * Creates a new Observer.
     * @template T - The type of the value emitted by the observer.
     * @param callbackfn - A function to apply to each value emitted by the observer.
     * @returns - The created Observer.
     */
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
        this._subscribe(observer, handler);
        unsubscribeRef = () => this._unsubscribe(handler);
        return observer;
    };

    /**
     * Applies a callback function to each value emitted by the Observable and flattens the resulting values into a new Observable.
     *
     * @template T - The type of values emitted by the Observable.
     *
     * @param callbackfn - A callback function that accepts a value emitted by the Observable and returns an array of values or a single value.
     *
     * @returns - A new Observer that emits the flattened values.
     */
    public flatMap = <T = any>(callbackfn: (value: Data) => T[]): Observer<T> => {
        let unsubscribeRef: Fn;
        const dispose = compose(
            () => this.tryDispose(),
            () => unsubscribeRef(),
        );
        const observer = new Observer<T>(dispose);
        const handler = (value: Data) => {
            const pendingValue = callbackfn(value);
            if (Array.isArray(pendingValue)) {
                pendingValue.forEach((value) => {
                    observer.emit(value);
                });
            } else {
                observer.emit(pendingValue);
            }
        };
        this._subscribe(observer, handler);
        unsubscribeRef = () => this._unsubscribe(handler);
        return observer;
    };

    /**
     * Operator function to create a new observer with a transformed data type.
     *
     * @template T - The type of the transformed data.
     * @param callbackfn - A callback function that takes the target observer and returns a new observer with transformed data.
     * @returns - A new observer with the transformed data type.
     */
    public operator = <T = any>(callbackfn: (target: TObserver<Data>) => TObserver<T>): TObserver<T> => {
        return callbackfn(this);
    };

    /**
     * Reduces the data emitted by an Observer using a callback function and an initial value.
     *
     * @template T - The type of the accumulator and the return value.
     * @param callbackfn - The callback function to execute on each emitted value.
     *   It takes an accumulator value and the current value being emitted, and returns the new accumulator value.
     * @param begin - The initial value of the accumulator.
     * @returns - An Observer that emits the accumulated value after each emission.
     */
    public reduce = <T = any>(callbackfn: (acm: T, cur: Data) => T, begin: T): Observer<T> => {
        let unsubscribeRef: Fn;
        let acm: T = begin;
        const dispose = compose(
            () => this.tryDispose(),
            () => unsubscribeRef(),
        );
        const observer = new Observer<T>(dispose);
        const handler = (value: Data) => {
            const pendingValue = callbackfn(acm, value);
            acm = pendingValue;
            observer.emit(pendingValue);
        };
        this._subscribe(observer, handler);
        unsubscribeRef = () => this._unsubscribe(handler);
        return observer;
    };

    /**
     * Creates and returns an observer function that splits an array of data
     * into a nested array of a specified length.
     *
     * @returns The split observer function.
     */
    public split = (): Observer<ReadonlyArray<FlatArray<Data[], 20>>> => {
        let unsubscribeRef: Fn;
        const dispose = compose(
            () => this.tryDispose(),
            () => unsubscribeRef(),
        );
        const observer = new Observer(dispose);
        const handler = (data: Data) => {
            if (Array.isArray(data)) {
                data.flat(Number.POSITIVE_INFINITY).forEach((item) => {
                    observer.emit(item);
                });
            } else {
                observer.emit(data);
            }
        };
        this._subscribe(observer, handler);
        unsubscribeRef = () => this._unsubscribe(handler);
        return observer;
    };

    /**
     * Creates an Observer with asynchronous mapping functionality.
     *
     * @template T - The type of the result of the mapping function.
     * @param callbackfn - The function used to map the incoming data.
     * @param [fallbackfn] - An optional fallback function to handle error cases. If not provided, the error will be rethrown.
     * @returns - The created Observer.
     */
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
                if (pendingValue !== CANCELED_SYMBOL) {
                    observer.emit(pendingValue);
                }
            } catch (e: any) {
                if (fallbackfn) {
                    fallbackfn(e);
                } else {
                    throw e;
                }
            }
        };
        this._subscribe(observer, handler);
        unsubscribeRef = compose(
            () => this._unsubscribe(handler),
            () => iteraction.clear(),
        );
        return observer;
    };

    /**
     * Creates a filtered observer.
     *
     * @param callbackfn - The filter callback function.
     * @returns The filtered observer.
     */
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
        this._subscribe(observer, handler);
        unsubscribeRef = () => this._unsubscribe(handler);
        return observer;
    };

    /**
     * Attaches a callback function to the tap observer. The callback function will be called with a value of type `Data` when the tap observer is triggered.
     *
     * @param callbackfn - A callback function that takes a value of type `Data` as an argument.
     * @returns - An observer object that can be used to manage the tap subscription.
     */
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
        this._subscribe(observer, handler);
        unsubscribeRef = () => this._unsubscribe(handler);
        return observer;
    };

    /**
     * Creates a debounced observer that emits values at a specified delay.
     *
     * @param delay - The delay (in milliseconds) between value emissions.
     * @returns The debounced observer.
     */
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
        this._subscribe(observer, handler);
        unsubscribeRef = compose(
            () => handler.clear(),
            () => this._unsubscribe(handler),
        );
        return observer;
    };

    /**
     * Emits the specified data to all observers.
     *
     * @param data - The data to be emitted.
     */
    public emit = (data: Data) => {
        this.broadcast.emit(OBSERVER_EVENT, data);
    };

    /**
     * Subscribes to the `OBSERVER_EVENT` and invokes the provided callback function.
     * Emits the `CONNECT_EVENT`.
     * Returns a composed function that will try to dispose and unsubscribe the callback.
     *
     * @param callbackfn - The callback function to be invoked when `OBSERVER_EVENT` is emitted.
     * @returns - The composed function that will try to dispose and unsubscribe the callback.
     */
    public connect = (callbackfn: (value: Data) => void) => {
        this.broadcast.subscribe(OBSERVER_EVENT, callbackfn);
        this.broadcast.emit(CONNECT_EVENT);
        return compose(
            () => this.tryDispose(),
            () => this._unsubscribe(callbackfn),
        );
    };

    /**
     * Executes a callback function once and provides a way to unsubscribe from further executions.
     *
     * @param callbackfn - The callback function to be executed once.
     * @returns - A function that can be called to unsubscribe from further executions of the callback.
     */
    public once = (callbackfn: (value: Data) => void) => {
        let unsubscribeRef: Fn;
        const handler = (value: Data) => {
            callbackfn(value);
            unsubscribeRef();
        };
        unsubscribeRef = this.connect(handler);
        return unsubscribeRef;
    };

    /**
     * Marks a variable as shared.
     *
     * @returns The shared variable object.
     */
    public share = () => {
        this._isShared = true;
        return this;
    };

    /**
     * Creates an observable sequence that emits values at specified intervals.
     * @param [interval=1000] - The time interval between emissions in milliseconds.
     * @returns The observer object to subscribe to.
     */
    public repeat = (interval = 1_000) => {
        let unsubscribeRef: Fn;
        let timeout: number;
        const dispose = compose(
            () => this.tryDispose(),
            () => unsubscribeRef(),
            () => timeout !== undefined && clearTimeout(timeout),
        );
        const observer = new Observer<Data>(dispose);
        const handler = (value: Data) => {
            if (timeout !== undefined) {
                clearTimeout(timeout);
            }
            observer.emit(value);
            if (this.hasListeners) {
                timeout = setTimeout(handler, interval, value);
            }
        };
        this._subscribe(observer, handler);
        unsubscribeRef = () => this._unsubscribe(handler);
        return observer;
    };

    /**
     * Merges an observer with the given observer, returning a new observer that emits values from both observers.
     *
     * @template T - The type of value emitted by the observer.
     * @param observer - The observer to merge with.
     * @returns - The merged observer.
     */
    public merge = <T = any>(observer: TObserver<T>): Observer<Data | T>  => {
        let unsubscribeRef: Fn;
        const dispose = compose(
            () => this.tryDispose(),
            () => unsubscribeRef(),
        );
        const merged = new Observer<Data | T>(dispose);
        const handler = (value: Data | T) => {
            merged.emit(value);
        };
        this._subscribe(merged, handler);
        let unsubscribe: Fn = () => undefined;
        merged[LISTEN_CONNECT](() => {
            unsubscribe = observer.connect(handler) || (() => undefined);
        });
        unsubscribeRef = compose(
            () => this._unsubscribe(handler),
            () => unsubscribe(),
        );
        return merged;
    };

    /**
     * Unsubscribes from all events and performs cleanup.
     *
     * @function
     * @name unsubscribe
     * @memberOf undefined
     *
     * @returns
     */
    public unsubscribe = () => {
        this.broadcast.unsubscribeAll();
        this.broadcast.emit(DISCONNECT_EVENT);
        this.dispose();
    };

    /**
     * Converts the current instance to a Promise that resolves with the data.
     *
     * @returns A Promise that resolves with the data.
     */
    public toPromise = () => new Promise<Data>((res) => {
        this.once((data) => res(data));
    });

    /**
     * Creates a context for iterating asynchronously using a generator function.
     *
     * @returns The iterator context object.
     * @property {AsyncGeneratorFunction} iterate - The generator function that can be used to iterate over the values.
     * @property {Function} done - Marks the iteration as complete.
     */
    public toIteratorContext = () => {
        const self = this;
        let isDone = false;
        const iterate = async function* () {
            while (!isDone) {
                const next = await self.toPromise();
                yield next as Data;
            }
        };
        return {
            iterate,
            done() {
                isDone = true;
            },
        }
    };

};

export { TObserver };

export default Observer;
