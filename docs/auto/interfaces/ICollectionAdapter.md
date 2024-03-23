# ICollectionAdapter

An interface representing a collection adapter.

## Properties

### items

```ts
items: IEntityAdapter<T>[]
```

Represents an array of IEntityAdapter objects.

### lastIdx

```ts
lastIdx: number
```

Represents the last index of an array or string.

### ids

```ts
ids: (string | number)[]
```

### isEmpty

```ts
isEmpty: boolean
```

Checks if a value is empty or not.

## Methods

### setData

```ts
setData: { (items: T[]): void; (items: T[]): void; }
```

Sets the data for the items.

### map

```ts
map: { <V = any>(callbackfn: (value: IEntityAdapter<T>, idx: number) => V): V[]; <V = any>(callbackfn: (value: IEntityAdapter<T>, idx: number) => V): V[]; }
```

Applies a mapping function to each value of an entity adapter and returns an array of the mapped values.

### filter

```ts
filter: { (predicate: (value: IEntityAdapter<T>, idx: number) => boolean): IEntityAdapter<T>[]; (predicate: (value: IEntityAdapter<T>, idx: number) => boolean): IEntityAdapter<...>[]; }
```

Filters an array of IEntityAdapter&lt;T&gt; objects based on a provided predicate function.

### find

```ts
find: { (predicate: (value: IEntityAdapter<T>, idx: number) => boolean): IEntityAdapter<T>; (predicate: (value: IEntityAdapter<T>, idx: number) => boolean): IEntityAdapter<...>; }
```

Finds the first element in the IEntityAdapter array that satisfies the provided testing function.

### some

```ts
some: { (predicate: (value: IEntityAdapter<T>, idx: number) => boolean): boolean; (predicate: (value: IEntityAdapter<T>, idx: number) => boolean): boolean; }
```

Checks if any of the elements in the array satisfies the provided predicate.

### forEach

```ts
forEach: { (callbackfn: (value: IEntityAdapter<T>, idx: number) => void): void; (callbackfn: (value: IEntityAdapter<T>, idx: number) => void): void; }
```

Executes a provided function once for each entity in the adapter.

### push

```ts
push: { (...items: T[] | T[][]): void; (...items: T[] | T[][]): void; }
```

Pushes one or more items onto the end of the array.

### upsert

```ts
upsert: { (...items: T[] | T[][]): void; (...items: T[] | T[][]): void; }
```

Upserts the given items into the database.

### remove

```ts
remove: { (item: IEntity): void; (item: IEntity): void; }
```

Removes the specified item from the collection.

### removeById

```ts
removeById: { (id: string | number): void; (id: string | number): void; }
```

Removes an entity from the collection by its id.

### removeAll

```ts
removeAll: { (): void; (): void; }
```

Removes all elements from the collection.

### findById

```ts
findById: { (id: string | number): IEntityAdapter<T>; (id: string | number): IEntityAdapter<T>; }
```

Finds an entity by its ID.

### clear

```ts
clear: { (): void; (): void; }
```

Clears the data of the object.

### refresh

```ts
refresh: { (): void; (): void; }
```

Refreshes the content of the page.

### toArray

```ts
toArray: { (): T[]; (): T[]; }
```

Converts the collection into an array.
