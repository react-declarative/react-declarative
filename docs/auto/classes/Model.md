# Model

Extends `EventEmitter`

Implements `IModelAdapter<T>`

## Constructor

```ts
constructor(_data: T | Model<T> | (() => T), _debounce: number, _prevData: () => T);
```

## Properties

### _debounce

```ts
_debounce: number
```

### _prevData

```ts
_prevData: () => T
```

### _dropChanges

```ts
_dropChanges: Subject<void>
```

### _data

```ts
_data: T
```

### handleDropChanges

```ts
handleDropChanges: () => void
```

### refresh

```ts
refresh: () => Promise<void>
```

### toObject

```ts
toObject: () => T
```

## Methods

### setData

```ts
setData(data: Partial<T> | ((prevData: T) => Partial<T>)): void;
```

### handleChange

```ts
handleChange(change: (item: Model<T>) => void): () => void;
```
