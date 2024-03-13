# CollectionAdapter

Implements `ICollectionAdapter<T>`

## Constructor

```ts
constructor(_collection$: MutableRefObject<Collection<T>>, _dispose: Subject<true>);
```

## Properties

### setData

```ts
setData: (items: T[]) => Promise<void>
```

### refresh

```ts
refresh: () => Promise<void>
```

### clear

```ts
clear: () => Promise<void>
```

### push

```ts
push: (...items: T[] | T[][]) => Promise<void>
```

### upsert

```ts
upsert: (...items: T[] | T[][]) => Promise<void>
```

### remove

```ts
remove: (entity: IEntity) => Promise<void>
```

### removeById

```ts
removeById: (id: string | number) => Promise<void>
```

### removeAll

```ts
removeAll: () => Promise<void>
```

### findById

```ts
findById: (id: string | number) => CollectionEntityAdapter<T>
```

### some

```ts
some: (fn: (value: CollectionEntityAdapter<T>, idx: number) => boolean) => boolean
```

### forEach

```ts
forEach: (fn: (value: CollectionEntityAdapter<T>, idx: number) => void) => void
```

### find

```ts
find: (fn: (value: CollectionEntityAdapter<T>, idx: number) => boolean) => CollectionEntityAdapter<T>
```

### filter

```ts
filter: (fn: (value: CollectionEntityAdapter<T>, idx: number) => boolean) => CollectionEntityAdapter<T>[]
```

### map

```ts
map: <V extends unknown = any>(fn: (value: CollectionEntityAdapter<T>, idx: number) => V) => V[]
```

### toArray

```ts
toArray: () => T[]
```

### toCollection

```ts
toCollection: () => Collection<T>
```
