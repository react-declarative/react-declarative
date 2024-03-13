# Observer

Implements `TObserver<Data>`

## Constructor

```ts
constructor(dispose: Fn);
```

## Properties

### map

```ts
map: <T = any>(callbackfn: (value: Data) => T) => Observer<T>
```

### flatMap

```ts
flatMap: <T = any>(callbackfn: (value: Data) => T[]) => Observer<T>
```

### operator

```ts
operator: <T = any>(callbackfn: (target: TObserver<Data>) => TObserver<T>) => TObserver<T>
```

### reduce

```ts
reduce: <T = any>(callbackfn: (acm: T, cur: Data) => T, begin: T) => Observer<T>
```

### split

```ts
split: () => Observer<readonly FlatArray<Data[], 20>[]>
```

### mapAsync

```ts
mapAsync: <T = any>(callbackfn: (value: Data) => Promise<T>, fallbackfn?: (e: Error) => void) => Observer<T>
```

### filter

```ts
filter: (callbackfn: (value: Data) => boolean) => Observer<Data>
```

### tap

```ts
tap: (callbackfn: (value: Data) => void) => Observer<Data>
```

### debounce

```ts
debounce: (delay?: number) => Observer<Data>
```

### emit

```ts
emit: (data: Data) => void
```

### connect

```ts
connect: (callbackfn: (value: Data) => void) => any
```

### once

```ts
once: (callbackfn: (value: Data) => void) => Fn
```

### share

```ts
share: () => this
```

### repeat

```ts
repeat: (interval?: number) => Observer<Data>
```

### merge

```ts
merge: <T = any>(observer: TObserver<T>) => Observer<Data | T>
```

### unsubscribe

```ts
unsubscribe: () => void
```

### toPromise

```ts
toPromise: () => Promise<Data>
```

### toIteratorContext

```ts
toIteratorContext: () => { iterate: () => AsyncGenerator<Awaited<Data>, void, unknown>; done(): void; }
```

## Methods

### __@LISTEN_CONNECT@798

```ts
[LISTEN_CONNECT](fn: () => void): void;
```

### __@LISTEN_DISCONNECT@799

```ts
[LISTEN_DISCONNECT](fn: () => void): void;
```
