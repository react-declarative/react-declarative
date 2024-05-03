# IOneButtonProps

## Properties

### withCloseAfterChange

```ts
withCloseAfterChange: boolean
```

### noBadge

```ts
noBadge: boolean
```

### fieldDebounce

```ts
fieldDebounce: number
```

### waitForChangesDelay

```ts
waitForChangesDelay: number
```

### fields

```ts
fields: IField<Data, Payload>[]
```

### payload

```ts
payload: Payload | (() => Payload)
```

### handler

```ts
handler: OneHandler<Data, Payload>
```

### onChange

```ts
onChange: (Data: Data, initial: boolean) => void
```

### onInvalid

```ts
onInvalid: (name: string, msg: string, payload: Payload) => void
```

### onFocus

```ts
onFocus: (name: string, data: Data, payload: Payload, onValueChange: (value: Value) => void, onChange: (data: Data) => void) => void
```

### onBlur

```ts
onBlur: (name: string, data: Data, payload: Payload, onValueChange: (value: Value) => void, onChange: (data: Data) => void) => void
```

### readTransform

```ts
readTransform: (value: string | string[], name: string, data: Data, payload: Payload) => Value
```

### writeTransform

```ts
writeTransform: (value: string | string[], name: string, data: Data, payload: Payload) => Value
```

### badgeColor

```ts
badgeColor: "primary" | "secondary" | "error" | "info" | "success" | "warning" | "default"
```

### badgeOverlap

```ts
badgeOverlap: "rectangular" | "circular"
```

### badgeSx

```ts
badgeSx: SxProps<any>
```

### oneSx

```ts
oneSx: SxProps<any>
```

### color

```ts
color: "primary" | "secondary" | "error" | "inherit" | "info" | "success" | "warning"
```
