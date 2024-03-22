# IFieldMenu

Represents a field menu.

## Properties

### isVisible

```ts
isVisible: (data: Data, payload: Payload) => boolean | Promise<boolean>
```

Determines the visibility of an element based on the given data and payload.

### isDisabled

```ts
isDisabled: (data: Data, payload: Payload) => boolean | Promise<boolean>
```

Checks whether the given data and payload indicate that the feature is disabled.

### onClick

```ts
onClick: (data: Data, payload: Payload, onValueChange: (value: Value) => void, onChange: (data: Data) => void) => void
```
