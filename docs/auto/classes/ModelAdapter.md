# ModelAdapter

Implements `IModelAdapter<T>`

## Constructor

```ts
constructor(_model$: MutableRefObject<Model<T>>, _dispose: Subject<true>);
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

### toModel

```ts
toModel: () => Model<T>
```
