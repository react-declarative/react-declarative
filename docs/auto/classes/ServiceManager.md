# ServiceManager

## Constructor

```ts
constructor(_name: string);
```

## Properties

### registerInstance

```ts
registerInstance: <T = object>(key: Key, inst: T) => void
```

### registerCreator

```ts
registerCreator: <T = object>(key: Key, ctor: () => T | Promise<T>) => void
```

### inject

```ts
inject: <T = object>(key: Key, verbose?: boolean) => T
```

### waitForProvide

```ts
waitForProvide: any
```

### prefetch

```ts
prefetch: any
```

### unload

```ts
unload: any
```

### clear

```ts
clear: () => void
```
