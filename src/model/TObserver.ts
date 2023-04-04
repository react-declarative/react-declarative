export interface TObserver<Data = unknown> {
    unsubscribe: () => void;
    map: <T = unknown>(callbackfn: (value: Data) => T) => TObserver<T>;
    mapAsync: <T = unknown>(callbackfn: (value: Data) => Promise<T>, fallbackfn?: (e: Error) => void) => TObserver<T>;
    filter: (callbackfn: (value: Data) => boolean) => TObserver<Data>;
    merge: <T = unknown>(observer: TObservable<T>) => TObserver<Data | T>;
    tap: (callbackfn: (value: Data) => void) => TObserver<Data>;
    debounce: (delay?: number) => TObserver<Data>;
    connect: (callbackfn: (value: Data) => void) => () => void;
    share: () => TObserver<Data>;
}

export type TObservable<Data = unknown> = Omit<TObserver<Data>, keyof {
    unsubscribe: never;
    connect: never;
    share: never;
}>;

export default TObserver;
