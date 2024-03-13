# TObservable

```ts
export type TObservable<Data = unknown> = Omit<TObserver<Data>, keyof {
    unsubscribe: never;
    connect: never;
    once: never;
    share: never;
}>;
```


