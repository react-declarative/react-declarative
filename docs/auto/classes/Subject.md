# Subject

Implements `TSubject<Data>`, `TObservable<Data>`

## Constructor

```ts
constructor();
```

## Properties

### map

```ts
map: <T = any>(callbackfn: (value: Data) => T) => TObserver<T>
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
mapAsync: <T = any>(callbackfn: (value: Data) => Promise<T>, fallbackfn?: (e: Error) => void) => TObserver<T>
```

### filter

```ts
filter: (callbackfn: (value: Data) => boolean) => TObserver<Data>
```

### tap

```ts
tap: (callbackfn: (value: Data) => void) => TObserver<Data>
```

### operator

```ts
operator: <T = any>(callbackfn: (value: TObserver<Data>) => TObserver<T>) => TObserver<T>
```

### split

```ts
split: () => Observer<readonly FlatArray<Data[], 20>[]>
```

### debounce

```ts
debounce: (delay?: number) => TObserver<Data>
```

### repeat

```ts
repeat: (interval?: number) => TObserver<Data>
```

### merge

```ts
merge: <T = any>(observer: TObserver<T>) => TObserver<Data | T>
```

### subscribe

```ts
subscribe: (callback: Function) => () => void
```

### unsubscribeAll

```ts
unsubscribeAll: () => void
```

### once

```ts
once: (callback: Function) => () => void
```

### toPromise

```ts
toPromise: () => Promise<Data>
```

### toIteratorContext

```ts
toIteratorContext: () => { iterate(): AsyncGenerator<Data, void, unknown>; done(): void; }
```

## Methods

### next

```ts
next(data: Data): Promise<void>;
```

### toObserver

```ts
toObserver(): TObserver<Data>;
```
