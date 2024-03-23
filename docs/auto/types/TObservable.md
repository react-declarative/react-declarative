# TObservable

```ts
export type TObservable<Data = unknown> = Omit<TObserver<Data>, keyof {
    unsubscribe: never;
    connect: never;
    once: never;
    share: never;
}>;
```

Represents an observable class that can be used to observe changes in data.
