# IModelAdapter

Represents an interface for a model adapter.

## Properties

### data

```ts
data: T
```

Represents a variable of unknown type T.

## Methods

### setData

```ts
setData: { (data: Partial<T> | ((prevData: T) => Partial<T>)): void; (data: Partial<T> | ((prevData: T) => Partial<T>)): void; }
```

Sets the data for the object.

### refresh

```ts
refresh: { (): void; (): void; }
```

Refreshes the page.

### toObject

```ts
toObject: { (): T; (): T; }
```

Returns an object representation of the instance.
