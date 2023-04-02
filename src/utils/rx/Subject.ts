import EventEmitter from "./EventEmitter";
import Observer from "./Observer";

import TSubject from "../../model/TSubject";
import TObserver, { TObservable } from "../../model/TObserver";

import compose from "../compose";

export const SUBJECT_EVENT = Symbol('react-declarative-subject');

type Function = (...args: any[]) => void;

export class Subject<Data = any> implements TSubject<Data>, TObservable<Data> {

    private _emitter = new EventEmitter();

    public static combine = <
        A = void,
        B = void,
        C = void,
        D = void,
        E = void,
        F = void,
        G = void,
        H = void,
        I = void,
        J = void
    >(
        a: TObservable<A>,
        b?: TObservable<B>,
        c?: TObservable<C>,
        d?: TObservable<D>,
        e?: TObservable<E>,
        f?: TObservable<F>,
        g?: TObservable<G>,
        h?: TObservable<H>,
        i?: TObservable<I>,
        j?: TObservable<J>,
    ) => {
        const observers = [a, b, c, d, e, f, g, h, i, j];
        let root = new Subject<A | B | C | D | E | F | G | H | I | J>().toObserver();
        observers.forEach((observer) => {
            if (observer) {
                root = root.merge<any>(observer);
            }
        });
        return root.share();
    };

    public static join = <
        A = void,
        B = void,
        C = void,
        D = void,
        E = void,
        F = void,
        G = void,
        H = void,
        I = void,
        J = void
    >({
        observers,
        buffer,
    }: {
        observers: [
            TObserver<A>,
            TObserver<B>?,
            TObserver<C>?,
            TObserver<D>?,
            TObserver<E>?,
            TObserver<F>?,
            TObserver<G>?,
            TObserver<H>?,
            TObserver<I>?,
            TObserver<J>?
        ],
        buffer: [
            A,
            B?,
            C?,
            D?,
            E?,
            F?,
            G?,
            H?,
            I?,
            J?,
        ],
    }) => {
        let disposeRef: Function;
        const observer = new Observer<[A, B, C, D, E, F, G, H, I, J]>(
            () => disposeRef(),
        );

        observers = observers.filter((value) => !!value) as any;
        buffer = [...new Array(observers.length)].map((_, idx) => buffer[idx]) as any;
        const subscriptions: Function[] = [];

        const next = () => {
            if (buffer.every((value) => value !== undefined)) {
                observer.emit(buffer as any);
            }
        };

        observers.forEach((observer, idx) => {
            if (observer) {
                const unsubscribe = observer.connect((value) => {
                    buffer[idx] = value;
                    next();
                });
                subscriptions.push(() => unsubscribe());
            }
        });
        disposeRef = compose(subscriptions);

        return observer.share();
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

    public debounce = (delay?: number): TObserver<Data> => {
        let unsubscribeRef: Function;
        const observer = new Observer<Data>(() => unsubscribeRef());
        unsubscribeRef = this.subscribe(observer.emit);
        return observer.debounce(delay);
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

    public toObserver = (): TObserver<Data> => {
        let unsubscribeRef: Function;
        const observer = new Observer<Data>(() => unsubscribeRef());
        unsubscribeRef = this.subscribe(observer.emit);
        return observer;
    };

};

export { TSubject };

export default Subject;
