# ICompleteFieldProps

Interface for specifying the props of a complete field.

## Properties

### inputType

```ts
inputType: "number" | "text" | "color" | "date" | "email" | "month" | "password" | "search" | "tel" | "time" | "url" | "week"
```

### inputMode

```ts
inputMode: "text" | "email" | "search" | "tel" | "url" | "none" | "numeric" | "decimal"
```

### inputPattern

```ts
inputPattern: string
```

### inputAutocomplete

```ts
inputAutocomplete: "new-password" | "on" | "off" | "false"
```

### description

```ts
description: string
```

### labelShrink

```ts
labelShrink: boolean
```

### keepRaw

```ts
keepRaw: boolean
```

### outlined

```ts
outlined: boolean
```

### title

```ts
title: string
```

### tip

```ts
tip: string[] | ((value: string, data: Data, payload: Payload) => string[] | Promise<string[]>)
```

### tipSelect

```ts
tipSelect: (value: string, data: Data, payload: Payload, onChange: (data: Data) => void) => void
```

### placeholder

```ts
placeholder: string
```

### readonly

```ts
readonly: boolean
```

### autoFocus

```ts
autoFocus: boolean
```

### disabled

```ts
disabled: boolean
```

### groupRef

```ts
groupRef: (element?: HTMLDivElement) => void
```

### inputRef

```ts
inputRef: (element?: HTMLInputElement) => void
```

### inputFormatter

```ts
inputFormatter: (input: string) => string
```

### inputFormatterSymbol

```ts
inputFormatterSymbol: string
```

### inputFormatterAllowed

```ts
inputFormatterAllowed: RegExp | ((char: string, idx: number) => boolean)
```

### inputFormatterTemplate

```ts
inputFormatterTemplate: string
```

### inputFormatterReplace

```ts
inputFormatterReplace: (char: string) => string
```
