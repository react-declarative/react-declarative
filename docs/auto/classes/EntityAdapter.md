# EntityAdapter

Implements `IEntityAdapter<T>`

## Constructor

```ts
constructor(_entity$: MutableRefObject<Entity<T>>, _dispose: Subject<true>);
```

## Properties

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
