# IFieldMenu

Represents a field menu.

## Properties

### isVisible

```ts
isVisible: (data: Data, payload: Payload) => boolean | Promise<boolean>
```

### isDisabled

```ts
isDisabled: (data: Data, payload: Payload) => boolean | Promise<boolean>
```

### onClick

```ts
onClick: (data: Data, payload: Payload, onValueChange: (value: Value) => void, onChange: (data: Data) => void) => void
```
