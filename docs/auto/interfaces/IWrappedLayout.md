# IWrappedLayout

Represents a layout with various properties that control its visibility, disabled state, and other features.

## Properties

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

### features

```ts
features: string[]
```

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
