import { TObserver } from "../Observer";

export const createObserver = <Data = any>(factory: () => TObserver<Data>): TObserver<Data> => ({
    tap: (callbackfn) => factory().tap(callbackfn),
    debounce: (delay) => factory().debounce(delay),
    repeat: (interval) => factory().repeat(interval),
    filter: (callbackfn) => factory().filter(callbackfn),
    map: (callbackfn) => factory().map(callbackfn),
    flatMap: (callbackfn) => factory().flatMap(callbackfn),
    operator: (callbackfn) => factory().operator(callbackfn),
    reduce: (callbackfn, begin) => factory().reduce(callbackfn, begin),
    mapAsync: (callbackfn, fallbackfn) => factory().mapAsync(callbackfn, fallbackfn),
    merge: (observer) => factory().merge(observer),
    split: () => factory().split(),
    connect: (callbackfn) => factory().connect(callbackfn),
    once: (callbackfn) => factory().once(callbackfn),
    unsubscribe: () => factory().unsubscribe(),
    share: () => factory().share(),
    toPromise: () => factory().toPromise(),
    toIteratorContext: () => factory().toIteratorContext(),
});

export default createObserver;
