# IEntityAdapter

## Properties

### id

```ts
id: string | number
```

### data

```ts
data: T
```

## Methods

### setData

```ts
setData: { (data: Partial<T> | ((prevData: T) => Partial<T>)): void; (data: Partial<T> | ((prevData: T) => Partial<T>)): void; }
```

### refresh

```ts
refresh: { (): void; (): void; }
```

### toObject

```ts
toObject: { (): T; (): T; }
```
