# TObserver

TObserver is an interface that represents an observable object.
It provides various methods to transform, filter, merge, and consume data emitted by the observable.

## Properties

### unsubscribe

```ts
unsubscribe: () => void
```

### map

```ts
map: <T = unknown>(callbackfn: (value: Data) => T) => TObserver<T>
```

### flatMap

```ts
flatMap: <T = any>(callbackfn: (value: Data) => T[]) => TObserver<T>
```

### reduce

```ts
reduce: <T = any>(callbackfn: (acm: T, cur: Data) => T, begin: T) => TObserver<T>
```

### mapAsync

```ts
mapAsync: <T = unknown>(callbackfn: (value: Data) => Promise<T>, fallbackfn?: (e: Error) => void) => TObserver<T>
```

### operator

```ts
operator: <T = any>(callbackfn: (target: TObserver<Data>) => TObserver<T>) => TObserver<T>
```

### filter

```ts
filter: (callbackfn: (value: Data) => boolean) => TObserver<Data>
```

### merge

```ts
merge: <T = unknown>(observer: TObserver<T>) => TObserver<Data | T>
```

### tap

```ts
tap: (callbackfn: (value: Data) => void) => TObserver<Data>
```

### split

```ts
split: () => TObserver<readonly FlatArray<Data[], 20>[]>
```

### debounce

```ts
debounce: (delay?: number) => TObserver<Data>
```

### repeat

```ts
repeat: (interval?: number) => TObserver<Data>
```

### connect

```ts
connect: (callbackfn: (value: Data) => void) => () => void
```

### once

```ts
once: (callbackfn: (value: Data) => void) => () => void
```

### share

```ts
share: () => TObserver<Data>
```

### toPromise

```ts
toPromise: () => Promise<Data>
```

### toIteratorContext

```ts
toIteratorContext: () => { iterate(): AsyncGenerator<Data, void, unknown>; done(): void; }
```
