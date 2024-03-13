# CollectionEntityAdapter

Implements `IEntityAdapter<T>`

## Constructor

```ts
constructor(id: string | number, _collection$: MutableRefObject<Collection<T>>, _dispose: Subject<true>);
```

## Properties

### id

```ts
id: string | number
```

### setData

```ts
setData: (data: Partial<T> | ((prevData: T) => Partial<T>)) => Promise<void>
```

### refresh

```ts
refresh: () => Promise<void>
```

### toObject

```ts
toObject: () => T
```

### toEntity

```ts
toEntity: () => Entity<T>
```
