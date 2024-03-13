# Collection

Extends `EventEmitter`

Implements `ICollectionAdapter<T>`

## Constructor

```ts
constructor(entities: T[] | (() => T[]) | Entity<T>[] | Collection<T>, _debounce: number, _prevData: () => Entity<T>[]);
```

## Properties

### _debounce

```ts
_debounce: number
```

### _prevData

```ts
_prevData: () => Entity<T>[]
```

### setData

```ts
setData: (items: T[]) => void
```

### clear

```ts
clear: () => void
```

### map

```ts
map: <V = any>(callbackfn: (value: Entity<T>, idx: number) => V) => V[]
```

### filter

```ts
filter: (predicate: (value: Entity<T>, idx: number) => boolean) => Entity<T>[]
```

### find

```ts
find: (predicate: (value: Entity<T>, idx: number) => boolean) => Entity<T>
```

### some

```ts
some: (predicate: (value: Entity<T>, idx: number) => boolean) => boolean
```

### forEach

```ts
forEach: (callbackfn: (value: Entity<T>, idx: number) => void) => void
```

### push

```ts
push: (...items: T[] | T[][]) => void
```

### upsert

```ts
upsert: (...items: T[] | T[][]) => void
```

### remove

```ts
remove: (item: IEntity) => void
```

### removeById

```ts
removeById: (id: string | number) => void
```

### removeAll

```ts
removeAll: () => void
```

### findById

```ts
findById: (id: string | number) => Entity<T>
```

### handleChange

```ts
handleChange: (change: (collection: Collection<T>, target: Entity<T>) => void) => () => void
```

### handleDropChanges

```ts
handleDropChanges: () => void
```

### refresh

```ts
refresh: () => Promise<void>
```

### toArray

```ts
toArray: () => T[]
```
