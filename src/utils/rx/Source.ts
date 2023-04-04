import Observer, { LISTEN_CONNECT } from "./Observer";

import TObserver, { TObservable } from "../../model/TObserver";
import Subject from "./Subject";

import fromInterval from "./source/fromInterval";
import fromPromise from "./source/fromPromise";
import fromDelay from './source/fromDelay';

import compose from "../compose";

type Function = (...args: any[]) => void;

export class Source {

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
    ): TObserver<A | B | C | D | E | F | G | H | I | J> => {
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
        race = false,
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
        race?: boolean;
    }): TObserver<[A, B, C, D, E, F, G, H, I, J]> => {
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
                !race && buffer.fill(undefined);
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

    public static createHot = <Data = any>(emitter: (next: (data: Data) => void) => () => void) => {
        let unsubscribeRef: Function;
        const observer = new Observer<Data>(() => unsubscribeRef());
        unsubscribeRef = emitter(observer.emit);
        return observer;
    };

    public static createCold = <Data = any>(emitter: (next: (data: Data) => void) => () => void) => {
        let unsubscribeRef: Function = () => undefined;
        const observer = new Observer<Data>(() => unsubscribeRef());
        observer[LISTEN_CONNECT](() => {
            unsubscribeRef = emitter(observer.emit);
        });
        return observer;
    };

    public static create = this.createCold;

    public static fromInterval = fromInterval;
    public static fromPromise = fromPromise;
    public static fromDelay = fromDelay;

};

export default Source;
