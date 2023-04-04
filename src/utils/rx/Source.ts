import Observer, { LISTEN_CONNECT } from "./Observer";

import TObserver from "../../model/TObserver";
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
    >(observers: [
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
    ]): TObserver<A | B | C | D | E | F | G | H | I | J> => {
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
    >(observers: [
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
    ], {
        race = false,
        buffer = [] as any,
    }: {
        buffer?: [
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
    } = {}): TObserver<[A, B, C, D, E, F, G, H, I, J]> => {
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

        observer[LISTEN_CONNECT](() => {
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
        });

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
            unsubscribeRef = emitter(observer.emit) || (() => undefined);
        });
        return observer.share();
    };

    public static create = this.createCold;

    public static fromInterval = fromInterval;
    public static fromPromise = fromPromise;
    public static fromDelay = fromDelay;

};

export default Source;
