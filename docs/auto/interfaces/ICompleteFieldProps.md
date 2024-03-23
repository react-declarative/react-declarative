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

Represents the optional prop "inputAutocomplete" for a field.

### description

```ts
description: string
```

Retrieves the "description" property from a given object and its nested properties if available.

### labelShrink

```ts
labelShrink: boolean
```

Reduces the size of the label for a given field.

### keepRaw

```ts
keepRaw: boolean
```

### outlined

```ts
outlined: boolean
```

Returns the value of the `outlined` property from the provided object.

### title

```ts
title: string
```

Type definition for the "title" property picked from the "IField" object type,
where "IField" is a generic object with properties "Data" and "Payload".
The resulting type is determined by the "PickProp" utility, which selects the specific property
from the provided object type.

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

Retrieves the `placeholder` property of a given field.

### readonly

```ts
readonly: boolean
```

Retrieves the "readonly" property from the provided field object.

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

Represents the input formatter property of a field within a specific data type.

### inputFormatterSymbol

```ts
inputFormatterSymbol: string
```

Represents the input formatter symbol for a specific field.

### inputFormatterAllowed

```ts
inputFormatterAllowed: RegExp | ((char: string, idx: number) => boolean)
```

### inputFormatterTemplate

```ts
inputFormatterTemplate: string
```

Represents a template for formatting input data.

### inputFormatterReplace

```ts
inputFormatterReplace: (char: string) => string
```

Replaces the input formatter of a field with a new one.
