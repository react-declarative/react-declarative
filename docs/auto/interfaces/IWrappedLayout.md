# IWrappedLayout

Represents a layout with various properties that control its visibility, disabled state, and other features.

## Properties

### testId

```ts
testId: string
```

Идентификатор для отладки json шаблона

### isVisible

```ts
isVisible: (v: Data, payload: Payload) => boolean
```

### isDisabled

```ts
isDisabled: (v: Data, payload: Payload) => boolean
```

### isReadonly

```ts
isReadonly: (v: Data, payload: Payload) => boolean
```

Retrieves the value of the 'isReadonly' property from the given variable.

### features

```ts
features: string[]
```

Retrieves the 'features' property from a given variable.

### disabled

```ts
disabled: boolean
```

### phoneHidden

```ts
phoneHidden: boolean | ((payload: Payload) => boolean)
```

### tabletHidden

```ts
tabletHidden: boolean | ((payload: Payload) => boolean)
```

### desktopHidden

```ts
desktopHidden: boolean | ((payload: Payload) => boolean)
```

### hidden

```ts
hidden: boolean | ((payload: Payload) => boolean)
```

### noBaseline

```ts
noBaseline: boolean
```

### baseline

```ts
baseline: boolean
```
