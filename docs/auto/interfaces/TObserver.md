# TObserver

TObserver is an interface that represents an observable object.
It provides various methods to transform, filter, merge, and consume data emitted by the observable.

## Properties

### unsubscribe

```ts
unsubscribe: () => void
```

Unsubscribe Function

### map

```ts
map: <T = unknown>(callbackfn: (value: Data) => T) => TObserver<T>
```

Applies a callback function to each value in a map and returns an observer for the result.

### flatMap

```ts
flatMap: <T = any>(callbackfn: (value: Data) => T[]) => TObserver<T>
```

Applies a callback function to each element of the Data array and flattens the result into a single array.

### reduce

```ts
reduce: <T = any>(callbackfn: (acm: T, cur: Data) => T, begin: T) => TObserver<T>
```

Represents a function to reduce the data in an array-like structure.

### mapAsync

```ts
mapAsync: <T = unknown>(callbackfn: (value: Data) => Promise<T>, fallbackfn?: (e: Error) => void) => TObserver<T>
```

Asynchronously applies a callback function to each element of the data stream and returns a TObserver&lt;T&gt; object.

### operator

```ts
operator: <T = any>(callbackfn: (target: TObserver<Data>) => TObserver<T>) => TObserver<T>
```

### filter

```ts
filter: (callbackfn: (value: Data) => boolean) => TObserver<Data>
```

Creates a filtered observer that applies a callback function to each value emitted by the source observer and only emits the values for which the callback returns true.

### merge

```ts
merge: <T = unknown>(observer: TObserver<T>) => TObserver<Data | T>
```

Merges the provided observer with another observer of type T, returning a new observer that emits values
of type `Data &vert; T`.

### tap

```ts
tap: (callbackfn: (value: Data) => void) => TObserver<Data>
```

Represents a tap function that takes a callback function to be executed.

### split

```ts
split: () => TObserver<readonly FlatArray<Data[], 20>[]>
```

Represents a function that splits an array into multiple arrays of a specified length.

### debounce

```ts
debounce: (delay?: number) => TObserver<Data>
```

Creates a debounced observer with optional delay.

### delay

```ts
delay: (delay?: number) => TObserver<Data>
```

Creates a delayed observer with optional delay.

### repeat

```ts
repeat: (interval?: number) => TObserver<Data>
```

A function that returns an observer with optional interval.

### connect

```ts
connect: (callbackfn: (value: Data) => void) => () => void
```

Represents a connection with a callback function.

### once

```ts
once: (callbackfn: (value: Data) => void) => () => void
```

Executes a given callback function once and returns a function that can be used to cancel the execution.

### share

```ts
share: () => TObserver<Data>
```

Represents a function that returns a TObserver object.

### toPromise

```ts
toPromise: () => Promise<Data>
```

Converts the given value to a Promise with the specified data type.

### toIteratorContext

```ts
toIteratorContext: () => { iterate(): AsyncGenerator<Data, void, unknown>; done(): void; }
```

Represents an iterator context.
