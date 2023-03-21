import EventEmitter from "./EventEmitter";

import TObserver from "../../model/TObserver";

import compose from '../compose';

export const OBSERVER_EVENT = Symbol('react-declarative-observer');

type Fn = (...args: any[]) => void;

export class Observer<Data = any> implements TObserver<Data> {

    private readonly broadcast = new EventEmitter();

    constructor(public readonly unsubscribe: Fn) { }

    map = <T = any>(callbackfn: (value: Data) => T): Observer<T> => {
        const dispose = compose(
            () => this.unsubscribe(),
            () => this.broadcast.unsubscribeAll(),
        );
        const observer = new Observer<T>(dispose);
        this.broadcast.subscribe(OBSERVER_EVENT, (value: Data) => {
            const pendingValue = callbackfn(value);
            observer.emit(pendingValue);
        });
        return observer;
    };

    filter = (callbackfn: (value: Data) => boolean): Observer<Data> => {
        const dispose = compose(
            () => this.unsubscribe(),
            () => this.broadcast.unsubscribeAll(),
        );
        const observer = new Observer<Data>(dispose);
        this.broadcast.subscribe(OBSERVER_EVENT, (value: Data) => {
            const delegate = callbackfn(value);
            if (delegate) {
                observer.emit(value);
            }
        });
        return observer;
    };

    tap = (callbackfn: (value: Data) => void): Observer<Data> => {
        const dispose = compose(
            () => this.unsubscribe(),
            () => this.broadcast.unsubscribeAll(),
        );
        const observer = new Observer<Data>(dispose);
        this.broadcast.subscribe(OBSERVER_EVENT, (value: Data) => {
            callbackfn(value);
            observer.emit(value);
        });
        return observer;
    };

    emit = (data: Data) => {
        this.broadcast.emit(OBSERVER_EVENT, data);
    };
};

export { TObserver };

export default Observer;
