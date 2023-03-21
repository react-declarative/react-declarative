export interface TObserver<Data = unknown> {
    unsubscribe: () => void;
    map: <T = unknown>(callbackfn: (value: Data) => T) => TObserver<T>;
    filter: (callbackfn: (value: Data) => boolean) => TObserver<Data>;
    tap: (callbackfn: (value: Data) => void) => TObserver<Data>;
}

export type TObservable<Data = unknown> = Omit<TObserver<Data>, keyof {
    unsubscribe: never;
}>;

export default TObserver;
