# Source

## Constructor

```ts
constructor();
```

## Properties

### merge

```ts
merge: <A = never, B = never, C = never, D = never, E = never, F = never, G = never, H = never, I = never, J = never>(observers: [TObserver<A>, TObserver<B>?, TObserver<C>?, TObserver<D>?, ... 5 more ...?, TObserver<...>?]) => TObserver<...>
```

### join

```ts
join: <A = never, B = never, C = never, D = never, E = never, F = never, G = never, H = never, I = never, J = never>(observers: [TObserver<A>, TObserver<B>?, TObserver<C>?, TObserver<D>?, ... 5 more ...?, TObserver<...>?], { race, buffer, }?: { ...; }) => TObserver<...>
```

### unicast

```ts
unicast: <Data = any>(factory: () => TObserver<Data>) => TObserver<Data> & { isUnicasted: true; }
```

### multicast

```ts
multicast: <Data = any>(factory: () => TObserver<Data>) => TObserver<Data> & { isMulticasted: true; getRef: any; }
```

### createHot

```ts
createHot: <Data = any>(emitter: (next: (data: Data) => void) => void | (() => void)) => Observer<Data>
```

### createCold

```ts
createCold: <Data = any>(emitter: (next: (data: Data) => void) => void | (() => void)) => Observer<Data>
```

### create

```ts
create: <Data = any>(emitter: (next: (data: Data) => void) => void | (() => void)) => Observer<Data>
```

### pipe

```ts
pipe: <Data = any, Output = any>(target: TObserver<Data>, emitter: (subject: TSubject<Data>, next: (output: Output) => void) => void | (() => void)) => Observer<Output>
```

### fromInterval

```ts
fromInterval: (delay: number) => TObserver<number>
```

### fromPromise

```ts
fromPromise: <Data = any>(callbackfn: () => Promise<Data>, fallbackfn?: (e: Error) => void) => TObserver<Data>
```

### fromDelay

```ts
fromDelay: (delay: number) => TObserver<void>
```

### fromArray

```ts
fromArray: <Data = any>(data: Data) => TObserver<readonly (Data extends readonly (infer InnerArr)[] ? InnerArr extends readonly (infer InnerArr)[] ? InnerArr extends readonly (infer InnerArr)[] ? InnerArr extends readonly (infer InnerArr)[] ? InnerArr extends readonly (infer InnerArr)[] ? InnerArr extends readonly (infer Inner...
```

### fromEvent

```ts
fromEvent: (event: keyof DocumentEventMap) => TObserver<MouseEvent | UIEvent | Event | ErrorEvent | ProgressEvent<EventTarget> | ... 13 more ... | WheelEvent>
```

### fromValue

```ts
fromValue: <Data = any>(data: Data | (() => Data)) => TObserver<Data>
```

### fromSubject

```ts
fromSubject: <Data = any>(subject: TSubject<Data>) => Observer<Data>
```

### fromBehaviorSubject

```ts
fromBehaviorSubject: <Data = any>(subject: TBehaviorSubject<Data>) => Observer<Data>
```
