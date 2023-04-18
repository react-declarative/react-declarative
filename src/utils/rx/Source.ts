import Observer, { LISTEN_CONNECT, LISTEN_DISCONNECT } from "./Observer";

import TObserver from "../../model/TObserver";
import Subject, { TSubject } from "./Subject";
import { TBehaviorSubject } from "./BehaviorSubject";

import fromInterval from "./source/fromInterval";
import fromPromise from "./source/fromPromise";
import fromDelay from './source/fromDelay';
import fromArray from './source/fromArray';

import createObserver from "./helpers/createObserver";

import compose from "../compose";

type Function = (...args: any[]) => void;

export class Source {

    public static merge = <
        A = never,
        B = never,
        C = never,
        D = never,
        E = never,
        F = never,
        G = never,
        H = never,
        I = never,
        J = never
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
        return root;
    };

    public static join = <
        A = never,
        B = never,
        C = never,
        D = never,
        E = never,
        F = never,
        G = never,
        H = never,
        I = never,
        J = never
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
        let disposeRef: Function = () => undefined;
        const observer = new Observer<[A, B, C, D, E, F, G, H, I, J]>(
            () => disposeRef(),
        );

        observers = observers.filter((value) => !!value) as any;
        buffer = [...new Array(observers.length)].map((_, idx) => buffer[idx]) as any;
        const subscriptions: Function[] = [];

        const next = () => {
            if (buffer.every((value) => value !== undefined)) {
                observer.emit([...buffer] as any);
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

        return observer;
    };

    public static unicast = <Data = any>(factory: () => TObserver<Data>): TObserver<Data> & {
        isUnicasted: true;
    } => ({
        ...createObserver(factory),
        isUnicasted: true,
    });

    public static multicast = <Data = any>(factory: () => TObserver<Data>): TObserver<Data> & {
        isMulticasted: true;
        getRef: any;
    } => {
        let observer: TObserver<Data> | undefined;
        return {
            ...createObserver(() => {
                if (!observer) {
                    observer = factory();
                    observer[LISTEN_DISCONNECT](() => {
                        observer = undefined;
                    });
                }
                return observer;
            }),
            getRef: () => observer,
            isMulticasted: true,
        };
    };

    public static createHot = <Data = any>(emitter: (next: (data: Data) => void) => ((() => void) | void)) => {
        let unsubscribeRef: Function;
        const observer = new Observer<Data>(() => unsubscribeRef());
        unsubscribeRef = emitter(observer.emit) || (() => undefined);
        return observer;
    };

    public static createCold = <Data = any>(emitter: (next: (data: Data) => void) => ((() => void) | void)) => {
        let unsubscribeRef: Function = () => undefined;
        const observer = new Observer<Data>(() => unsubscribeRef());
        observer[LISTEN_CONNECT](() => {
            unsubscribeRef = emitter(observer.emit) || (() => undefined);
        });
        return observer;
    };

    public static create = this.createCold;

    public static pipe = <Data = any, Output = any>(target: TObserver<Data>, emitter: (subject: TSubject<Data>, next: (output: Output) => void) => ((() => void) | void)) => {
        let unsubscribeRef: Function = () => undefined;
        const observer = new Observer<Output>(() => unsubscribeRef());
        observer[LISTEN_CONNECT](() => {
            const subject = new Subject<Data>();
            const unsubscribeTarget = target.connect(subject.next);
            const unsubscribeEmitter = emitter(subject, observer.emit) || (() => undefined);
            unsubscribeRef = compose(
                () => unsubscribeEmitter(),
                () => unsubscribeTarget(),
            );
        });
        return observer;
    };

    public static fromInterval = fromInterval;
    public static fromPromise = fromPromise;
    public static fromDelay = fromDelay;
    public static fromArray = fromArray;

    public static fromValue = <Data = any>(data: Data | (() => Data)): TObserver<Data> => {
        const observer = new Observer<Data>(() => undefined);
        observer[LISTEN_CONNECT](() => {
            if (typeof data === 'function') {
                observer.emit((data as () => Data)());
            } else {
                observer.emit(data);
            }
        });
        return observer;
    };

    public static fromSubject = <Data = any>(subject: TSubject<Data>) => {
        let unsubscribeRef: Function;
        const observer = new Observer<Data>(() => unsubscribeRef());
        unsubscribeRef = subject.subscribe(observer.emit);
        return observer;
    };

    public static fromBehaviorSubject = <Data = any>(subject: TBehaviorSubject<Data>) => {
        let unsubscribeRef: Function;
        const observer = new Observer<Data>(() => unsubscribeRef());
        observer[LISTEN_CONNECT](() => {
            subject.data && observer.emit(subject.data);
        });
        unsubscribeRef = subject.subscribe(observer.emit);
        return observer;
    };

};

export default Source;

/*
Source.join([
    Source.create<string>((next) => next("1")),
    Source.create<number>((next) => next(2)),
    Source.create<boolean>((next) => next(false)),
]).split().connect((value) => console.log(value));
*/

/*
const { Source } = require('.')
const multicast = Source.multicast(() => Source.create(() => {
    console.log('ctor');
    return () => console.log('dtor');
}));
const c1 = multicast.connect((v) => console.log(v))
const c2 = multicast.connect((v) => console.log(v))
c1()
c2()
const c3 = multicast.connect((v) => console.log(v))
*/