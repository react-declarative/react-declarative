# Entity

Extends `Model<T>`

Implements `IEntityAdapter<T>`

## Constructor

```ts
constructor(_data: T | Entity<T> | (() => T), _debounce: number, _prevData: () => T);
```

## Properties

### setData

```ts
setData: (data: Partial<T> | ((prevData: T) => Partial<T>)) => void
```

### handleChange

```ts
handleChange: (change: (item: Entity<T>) => void) => () => void
```
