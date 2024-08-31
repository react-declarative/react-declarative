# IState

Represents the interface for a state object.

## Properties

### object

```ts
object: Data
```

### setObject

```ts
setObject: (data: Data, invalidMap: Record<string, boolean>) => void
```

### getObjectRef

```ts
getObjectRef: () => Data
```

### changeObject

```ts
changeObject: (data: Data) => void
```
