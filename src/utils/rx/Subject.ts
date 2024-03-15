import EventEmitter from "./EventEmitter";
import Observer from "./Observer";

import TSubject from "../../model/TSubject";
import TObserver, { TObservable } from "../../model/TObserver";

export const SUBJECT_EVENT = Symbol('react-declarative-subject');

type Function = (...args: any[]) => void;

/**
 * Represents a subject that can emit data and be subscribed to.
 * @class
 * @implements {TSubject<Data>}
 * @implements {TObservable<Data>}
 * @template Data - The type of data that the subject emits.
 */
export class Subject<Data = any> implements TSubject<Data>, TObservable<Data> {

    private _emitter = new EventEmitter();

    constructor() {
        this.next = this.next.bind(this);
        this.toObserver = this.toObserver.bind(this);
        this.toIteratorContext = this.toIteratorContext.bind(this);
    };

    /**
     * Maps the values of the observer using the given callback function.
     *
     * @template T - The type of the mapped values.
     * @param callbackfn - A function that maps each value of the observer.
     * @returns - An observer with the mapped values.
     */
    public map = <T = any>(callbackfn: (value: Data) => T): TObserver<T> => {
        let unsubscribeRef: Function;
        const observer = new Observer<Data>(() => unsubscribeRef());
        unsubscribeRef = this.subscribe(observer.emit);
        return observer.map(callbackfn);
    };

    /**
     * Applies a transformation function to each value emitted by the observer and flattens the result into a single observer.
     * @template T - The type of values emitted by the observer.
     * @param callbackfn - The transformation function to apply to each value emitted by the observer.
     * @returns - The observer that emits the flattened values.
     */
    public flatMap = <T = any>(callbackfn: (value: Data) => T[]): TObserver<T> => {
        let unsubscribeRef: Function;
        const observer = new Observer<Data>(() => unsubscribeRef());
        unsubscribeRef = this.subscribe(observer.emit);
        return observer.flatMap(callbackfn);
    };

    /**
     * Applies a reducer function to each value emitted by the observer and returns a single accumulated value.
     *
     * @template T - The type of the accumulated value and emitted values
     * @param callbackfn - A function that accepts the accumulated value and the current emitted value, and returns the new accumulated value
     * @param begin - The initial value for the accumulator
     * @returns - An observer that emits the accumulated value when the original observer completes
     */
    public reduce = <T = any>(callbackfn: (acm: T, cur: Data) => T, begin: T): TObserver<T> => {
        let unsubscribeRef: Function;
        const observer = new Observer<Data>(() => unsubscribeRef());
        unsubscribeRef = this.subscribe(observer.emit);
        return observer.reduce(callbackfn, begin);
    };

    /**
     * Asynchronously maps the emitted values of the observer using the provided callback function.
     *
     * @template T - The type of the mapped values.
     * @param callbackfn - The callback function that maps the emitted values of the observer.
     * @param [fallbackfn] - The optional fallback function that handles errors during mapping.
     * @returns - Returns a new observer that emits the mapped values.
     */
    public mapAsync = <T = any>(callbackfn: (value: Data) => Promise<T>, fallbackfn?: (e: Error) => void): TObserver<T> => {
        let unsubscribeRef: Function;
        const observer = new Observer<Data>(() => unsubscribeRef());
        unsubscribeRef = this.subscribe(observer.emit);
        return observer.mapAsync(callbackfn, fallbackfn);
    };

    /**
     * Applies a filtering function to the observer and returns a new observer with filtered values.
     *
     * @param callbackfn - A function that tests each value in the observer. Should return true or false.
     * @returns - A new observer with filtered values.
     */
    public filter = (callbackfn: (value: Data) => boolean): TObserver<Data> => {
        let unsubscribeRef: Function;
        const observer = new Observer<Data>(() => unsubscribeRef());
        unsubscribeRef = this.subscribe(observer.emit);
        return observer.filter(callbackfn);
    };

    /**
     * The tap function allows you to perform side effects without modifying the observed data.
     *
     */
    public tap = (callbackfn: (value: Data) => void): TObserver<Data> => {
        let unsubscribeRef: Function;
        const observer = new Observer<Data>(() => unsubscribeRef());
        unsubscribeRef = this.subscribe(observer.emit);
        return observer.tap(callbackfn);
    };

    /**
     * Applies a callback function to the values emitted by an observer.
     *
     * @param callbackfn - The callback function to apply to the emitted values.
     * @returns - An observer with the applied operator.
     *
     * @template T - The type of values emitted by the observer.
     *
     * @memberof Operator
     * @category Observables
     */
    public operator = <T = any>(callbackfn: (value: TObserver<Data>) => TObserver<T>): TObserver<T> => {
        let unsubscribeRef: Function;
        const observer = new Observer<Data>(() => unsubscribeRef());
        unsubscribeRef = this.subscribe(observer.emit);
        return observer.operator(callbackfn);
    };

    /**
     * Splits the observed data into batches of arrays.
     *
     * @returns - The observer that emits batches of arrays.
     */
    public split = (): Observer<ReadonlyArray<FlatArray<Data[], 20>>> => {
        let unsubscribeRef: Function;
        const observer = new Observer<Data>(() => unsubscribeRef());
        unsubscribeRef = this.subscribe(observer.emit);
        return observer.split();
    };

    /**
     * Creates a debounced observer with an optional delay.
     * @param [delay] - The delay in milliseconds before emitting the data.
     * @returns - The debounced observer.
     */
    public debounce = (delay?: number): TObserver<Data> => {
        let unsubscribeRef: Function;
        const observer = new Observer<Data>(() => unsubscribeRef());
        unsubscribeRef = this.subscribe(observer.emit);
        return observer.debounce(delay);
    };

    /**
     * Creates an observer that repeats emitting values at a specified interval.
     *
     * @param [interval] - The time interval at which to repeat emitting values.
     * @returns - The created observer.
     */
    public repeat = (interval?: number): TObserver<Data> => {
        let unsubscribeRef: Function;
        const observer = new Observer<Data>(() => unsubscribeRef());
        unsubscribeRef = this.subscribe(observer.emit);
        return observer.repeat(interval);
    };

    /**
     * Merges the provided observer with the current observer instance.
     * Returns a new observer that emits values from both observers.
     *
     * @param observer - The observer to merge with the current observer.
     * @returns - A new observer that emits values from both observers.
     */
    public merge = <T = any>(observer: TObserver<T>): TObserver<Data | T> => {
        let unsubscribeRef: Function;
        const merged = new Observer<Data>(() => unsubscribeRef());
        unsubscribeRef = this.subscribe(merged.emit);
        return merged.merge(observer);
    };

    /**
     * Subscribes to an event.
     *
     * @param callback - The callback function to be invoked when the event is triggered.
     * @returns - A function to unsubscribe from the event.
     */
    public subscribe = (callback: Function) => {
        this._emitter.subscribe(SUBJECT_EVENT, callback);
        return () => {
            this._emitter.unsubscribe(SUBJECT_EVENT, callback);
        }
    };

    /**
     * Unsubscribes all event listeners.
     *
     * @function unsubscribeAll
     * @instance
     * @returns - No return value.
     */
    public unsubscribeAll = () => {
        this._emitter.unsubscribeAll();
    };

    /**
     * Executes the provided callback function only once.
     * The callback function will be invoked when the specified event occurs for the first time.
     *
     * @param callback - The function to be executed only once.
     * @returns - A function that removes the registered event listener.
     */
    public once = (callback: Function) => {
        return this._emitter.once(SUBJECT_EVENT, callback);
    };

    /**
     * Calls the next method to emit the specified data using the SUBJECT_EVENT event.
     *
     * @param data - The data to be emitted.
     * @return - Resolves when the emission is complete.
     */
    public async next(data: Data) {
        await this._emitter.emit(SUBJECT_EVENT, data);
    };

    /**
     * Creates a new observer to observe the data emitted by a source.
     *
     * @template TObserver - The type of observer.
     * @template Data - The type of data emitted by the source.
     * @returns - The created observer.
     */
    public toObserver(): TObserver<Data> {
        let unsubscribeRef: Function;
        const observer = new Observer<Data>(() => unsubscribeRef());
        unsubscribeRef = this.subscribe(observer.emit);
        return observer;
    };

    /**
     * Converts an observer-based asynchronous operation into a promise-based asynchronous operation.
     *
     * @function toPromise
     * @instance
     * @returns A promise representing the completion or failure of the asynchronous operation.
     */
    public toPromise = () => this.toObserver().toPromise();

    /**
     * Converts the current object to an iterator context.
     *
     * @function
     * @returns The iterator context representing the current object.
     */
    public toIteratorContext = () => this.toObserver().toIteratorContext();

};

export { TSubject };

export default Subject;
