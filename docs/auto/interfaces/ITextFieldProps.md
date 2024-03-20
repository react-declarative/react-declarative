# ITextFieldProps

Represents the properties for a text field component.

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

### description

```ts
description: string
```

### outlined

```ts
outlined: boolean
```

### title

```ts
title: string
```

### leadingIconRipple

```ts
leadingIconRipple: boolean
```

### trailingIconRipple

```ts
trailingIconRipple: boolean
```

### leadingIcon

```ts
leadingIcon: ComponentType<any>
```

### trailingIcon

```ts
trailingIcon: ComponentType<any>
```

### leadingIconClick

```ts
leadingIconClick: (value: Value, data: Data, payload: Payload, onValueChange: (v: Value) => void, onChange: (data: Data) => void) => void
```

### trailingIconClick

```ts
trailingIconClick: (value: Value, data: Data, payload: Payload, onValueChange: (v: Value) => void, onChange: (data: Data) => void) => void
```

### inputRows

```ts
inputRows: number
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

### labelShrink

```ts
labelShrink: boolean
```
