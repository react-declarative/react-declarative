# IDictFieldProps

Props for the IDictField component.

## Properties

### dictLimit

```ts
dictLimit: number
```

### dictDelay

```ts
dictDelay: number
```

### dictSearch

```ts
dictSearch: (dto: { search: string; limit: number; offset: number; initial: boolean; rows: ISearchItem<any>[]; data: Data; payload: Payload; }) => ISearchItem<any>[] | Promise<...>
```

### dictOnAppend

```ts
dictOnAppend: (search: string, data: Data, payload: Payload, onValueChange: (value: string) => void, onChange: (value: Data) => void) => void
```

### dictOnText

```ts
dictOnText: (text: string, data: Data, payload: Payload, onValueChange: (value: string) => void, onChange: (data: Data) => void) => void
```

### dictOnItem

```ts
dictOnItem: (value: string, data: Data, payload: Payload, onValueChange: (value: string) => void, onChange: (data: Data) => void) => void
```

### dictValue

```ts
dictValue: (value: string, data: Data, payload: Payload) => ISearchItem<any> | Promise<ISearchItem<any>>
```

### dictSearchText

```ts
dictSearchText: (data: Data, payload: Payload) => string | Promise<string>
```

### dictSearchItem

```ts
dictSearchItem: ComponentType<ISearchItemProps<any>>
```

### dictCreateButton

```ts
dictCreateButton: ComponentType<ICreateButtonProps>
```

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

### placeholder

```ts
placeholder: string
```

### readonly

```ts
readonly: boolean
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
