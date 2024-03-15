import Observer, { LISTEN_CONNECT, LISTEN_DISCONNECT } from "./Observer";

import TObserver from "../../model/TObserver";
import Subject, { TSubject } from "./Subject";
import { TBehaviorSubject } from "./BehaviorSubject";

import fromInterval from "./source/fromInterval";
import fromPromise from "./source/fromPromise";
import fromDelay from './source/fromDelay';
import fromArray from './source/fromArray';
import fromEvent from "./source/fromEvent";

import createObserver from "./helpers/createObserver";

import compose from "../compose";

type Function = (...args: any[]) => void;

/**
 * The Source class provides utility functions for creating and manipulating Observers.
 */
export class Source {

    /**
     * Merges multiple observers into a single observer.
     *
     * @template A - The type of observer A.
     * @template B - The type of observer B.
     * @template C - The type of observer C.
     * @template D - The type of observer D.
     * @template E - The type of observer E.
     * @template F - The type of observer F.
     * @template G - The type of observer G.
     * @template H - The type of observer H.
     * @template I - The type of observer I.
     * @template J - The type of observer J.
     *
     * @param observers - An array of observers to merge.
     *
     * @returns - The merged observer.
     */
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

    /**
     * Creates a join observer that combines the values emitted by multiple Observers into a single Observable.
     *
     * @template A - The type of the value emitted by the first Observer.
     * @template B - The type of the value emitted by the second Observer.
     * @template C - The type of the value emitted by the third Observer.
     * @template D - The type of the value emitted by the fourth Observer.
     * @template E - The type of the value emitted by the fifth Observer.
     * @template F - The type of the value emitted by the sixth Observer.
     * @template G - The type of the value emitted by the seventh Observer.
     * @template H - The type of the value emitted by the eighth Observer.
     * @template I - The type of the value emitted by the ninth Observer.
     * @template J - The type of the value emitted by the tenth Observer.
     *
     * @param observers - An array of Observers to join.
     * @param options - Optional parameters for the join operation, including a buffer and a race flag.
     * @param options.buffer - An array to store the latest emitted values from each Observer. Defaults to an empty array.
     * @param options.race - A boolean flag indicating whether to emit the combined values immediately or wait for all Observers to emit a value. Defaults to false.
     *
     * @returns An Observer that emits an array of values, each value being the latest emitted value from the corresponding Observer.
     */
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
            disposeRef = compose(...subscriptions);
        });

        return observer;
    };

    /**
     * @typedef {Object} Unicast
     * @template Data - The type of data the observer handles.
     *
     * @property {function(): TObserver<Data>} factory - A factory function to create the observer.
     * @property {boolean} isUnicasted - Indicates whether the observer is unicast.
     *
     * @returns - A unicast observer instance.
     */
    public static unicast = <Data = any>(factory: () => TObserver<Data>): TObserver<Data> & {
        isUnicasted: true;
    } => ({
        ...createObserver(factory),
        isUnicasted: true,
    });

    /**
     * Creates a multicast observer.
     *
     * @template Data - The type of data being observed.
     * @param factory - A factory function that creates the observer.
     * @returns - The multicast observer.
     */
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

    /**
     * Creates a hot observable that emits data as it is received from the given emitter.
     *
     * @template Data The type of data emitted by the observable.
     * @param emitter The function that receives a callback to emit data. It should return a cleanup function or `undefined`.
     * @returns The observer that allows subscribing to and unsubscribing from the emitted data.
     */
    public static createHot = <Data = any>(emitter: (next: (data: Data) => void) => ((() => void) | void)) => {
        let unsubscribeRef: Function;
        const observer = new Observer<Data>(() => unsubscribeRef());
        unsubscribeRef = emitter(observer.emit) || (() => undefined);
        return observer;
    };

    /**
     * Creates a cold observable.
     *
     * @param emitter - The emitter function which is called when a subscriber is added.
     *                            It should return a function that is called when the subscription is unsubscribed,
     *                            or return `undefined` if no cleanup is needed.
     * @returns - The created observer.
     */
    public static createCold = <Data = any>(emitter: (next: (data: Data) => void) => ((() => void) | void)) => {
        let unsubscribeRef: Function = () => undefined;
        const observer = new Observer<Data>(() => unsubscribeRef());
        observer[LISTEN_CONNECT](() => {
            unsubscribeRef = emitter(observer.emit) || (() => undefined);
        });
        return observer;
    };

    /**
     * Creates a new instance of the Cold object.
     */
    public static create = this.createCold;

    /**
     * Creates a pipe that connects an observer to a subject and emits output values based on a given emitter function.
     *
     * @param target - The observer that will receive output values.
     * @param emitter - A function that takes a subject and a next function and returns an unsubscribe function.
     * @returns The observer that is connected to the subject and emits output values.
     * @template Data - The type of data that will be observed.
     * @template Output - The type of output that will be emitted.
     */
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
    public static fromEvent = fromEvent;

    /**
     * Creates a new observer that emits a value from the given data or function.
     *
     * @param data - The data or function to emit from the observer.
     * @returns - The created observer.
     */
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

    /**
     * Creates an observer from the given subject and returns it.
     *
     * @template Data - The type of data emitted by the observer.
     * @param subject - The subject to create the observer from.
     * @returns - The observer created from the subject.
     */
    public static fromSubject = <Data = any>(subject: TSubject<Data>) => {
        let unsubscribeRef: Function;
        const observer = new Observer<Data>(() => unsubscribeRef());
        unsubscribeRef = subject.subscribe(observer.emit);
        return observer;
    };

    /**
     * Creates an observer from a BehaviorSubject.
     *
     * @template Data The type of data emitted by the BehaviorSubject.
     * @param subject - The BehaviorSubject to create the observer from.
     * @returns The observer created from the BehaviorSubject.
     */
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