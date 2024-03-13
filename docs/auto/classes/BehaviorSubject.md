# BehaviorSubject

Extends `Subject<Data>`

Implements `TBehaviorSubject<Data>`, `TObservable<Data>`

## Constructor

```ts
constructor(_data: Data);
```

## Properties

### next

```ts
next: (data: Data) => Promise<void>
```

### toObserver

```ts
toObserver: () => TObserver<Data>
```
