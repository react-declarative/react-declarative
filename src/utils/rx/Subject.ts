import EventEmitter from "./EventEmitter";
import Observer from "./Observer";

import TSubject from "../../model/TSubject";
import TObserver, { TObservable } from "../../model/TObserver";

export const SUBJECT_EVENT = Symbol('react-declarative-subject');

type Function = (...args: any[]) => void;

export class Subject<Data = any> implements TSubject<Data>, TObservable<Data> {

    private _emitter = new EventEmitter();

    public static combine = <T = any>(...observers: TObservable<unknown>[]) => {
        let root: TObservable<unknown> = new Subject<T>();
        observers.forEach((observer) => {
            root = root.merge(observer);
        });
        return root as TObservable<T>;
    };

    constructor() {
        this.next = this.next.bind(this);
    };

    public map = <T = any>(callbackfn: (value: Data) => T): TObserver<T> => {
        let unsubscribeRef: Function;
        const observer = new Observer<Data>(() => unsubscribeRef());
        unsubscribeRef = this.subscribe(observer.emit);
        return observer.map(callbackfn);
    };

    public mapAsync = <T = any>(callbackfn: (value: Data) => Promise<T>, fallbackfn?: (e: Error) => void): TObserver<T> => {
        let unsubscribeRef: Function;
        const observer = new Observer<Data>(() => unsubscribeRef());
        unsubscribeRef = this.subscribe(observer.emit);
        return observer.mapAsync(callbackfn, fallbackfn);
    };

    public filter = (callbackfn: (value: Data) => boolean): TObserver<Data> => {
        let unsubscribeRef: Function;
        const observer = new Observer<Data>(() => unsubscribeRef());
        unsubscribeRef = this.subscribe(observer.emit);
        return observer.filter(callbackfn);
    };

    public tap = (callbackfn: (value: Data) => void): TObserver<Data> => {
        let unsubscribeRef: Function;
        const observer = new Observer<Data>(() => unsubscribeRef());
        unsubscribeRef = this.subscribe(observer.emit);
        return observer.tap(callbackfn);
    };

    public merge = <T = any>(observer: TObservable<T>): TObserver<Data | T> => {
        let unsubscribeRef: Function;
        const merged = new Observer<Data>(() => unsubscribeRef());
        unsubscribeRef = this.subscribe(merged.emit);
        return merged.merge(observer);
    };

    public subscribe = (callback: Function) => {
        this._emitter.subscribe(SUBJECT_EVENT, callback);
        return () => {
            this._emitter.unsubscribe(SUBJECT_EVENT, callback);
        }
    };

    public unsubscribeAll = () => {
        this._emitter.unsubscribeAll();
    };

    public once = (callback: Function) => {
        return this._emitter.once(SUBJECT_EVENT, callback);
    };

    public next(data: Data) {
        this._emitter.emit(SUBJECT_EVENT, data);
    };

};

export { TSubject };

export default Subject;
