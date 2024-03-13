# ICollectionAdapter

## Properties

### items

```ts
items: IEntityAdapter<T>[]
```

### lastIdx

```ts
lastIdx: number
```

### ids

```ts
ids: (string | number)[]
```

### isEmpty

```ts
isEmpty: boolean
```

## Methods

### setData

```ts
setData: { (items: T[]): void; (items: T[]): void; }
```

### map

```ts
map: { <V = any>(callbackfn: (value: IEntityAdapter<T>, idx: number) => V): V[]; <V = any>(callbackfn: (value: IEntityAdapter<T>, idx: number) => V): V[]; }
```

### filter

```ts
filter: { (predicate: (value: IEntityAdapter<T>, idx: number) => boolean): IEntityAdapter<T>[]; (predicate: (value: IEntityAdapter<T>, idx: number) => boolean): IEntityAdapter<...>[]; }
```

### find

```ts
find: { (predicate: (value: IEntityAdapter<T>, idx: number) => boolean): IEntityAdapter<T>; (predicate: (value: IEntityAdapter<T>, idx: number) => boolean): IEntityAdapter<...>; }
```

### some

```ts
some: { (predicate: (value: IEntityAdapter<T>, idx: number) => boolean): boolean; (predicate: (value: IEntityAdapter<T>, idx: number) => boolean): boolean; }
```

### forEach

```ts
forEach: { (callbackfn: (value: IEntityAdapter<T>, idx: number) => void): void; (callbackfn: (value: IEntityAdapter<T>, idx: number) => void): void; }
```

### push

```ts
push: { (...items: T[] | T[][]): void; (...items: T[] | T[][]): void; }
```

### upsert

```ts
upsert: { (...items: T[] | T[][]): void; (...items: T[] | T[][]): void; }
```

### remove

```ts
remove: { (item: IEntity): void; (item: IEntity): void; }
```

### removeById

```ts
removeById: { (id: string | number): void; (id: string | number): void; }
```

### removeAll

```ts
removeAll: { (): void; (): void; }
```

### findById

```ts
findById: { (id: string | number): IEntityAdapter<T>; (id: string | number): IEntityAdapter<T>; }
```

### clear

```ts
clear: { (): void; (): void; }
```

### refresh

```ts
refresh: { (): void; (): void; }
```

### toArray

```ts
toArray: { (): T[]; (): T[]; }
```
