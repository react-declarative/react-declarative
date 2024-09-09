# ITextFieldProps

Represents the properties for a text field component.

## Properties

### validation

```ts
validation: IValidation
```

Validation factory config

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

Represents the input formatter function for a specific field in the Data object.

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

Returns the "description" property value of the given field object.

### outlined

```ts
outlined: boolean
```

Type definition to pick the `outlined` property from a given `IField` type.

### title

```ts
title: string
```

Type definition for the `title` property of an object.

### leadingIconRipple

```ts
leadingIconRipple: boolean
```

### trailingIconRipple

```ts
trailingIconRipple: boolean
```

Represents the option to enable or disable the trailing icon ripple effect.

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

Represents the leading icon click event handler for a field in a form.

### trailingIconClick

```ts
trailingIconClick: (value: Value, data: Data, payload: Payload, onValueChange: (v: Value) => void, onChange: (data: Data) => void) => void
```

The `trailingIconClick` property is an optional property
that represents a callback function to be executed when
the trailing icon of a field is clicked.

This property is of type `PickProp&lt;IField&lt;Data, Payload&gt;, "trailingIconClick"&gt;`,
where `IField&lt;Data, Payload&gt;` is a generic type representing a field with
`Data` and `Payload` types.
The `trailingIconClick` property is an optional property
that represents a callback function to be executed when
the trailing icon of a field is clicked.

This property is of type `PickProp<IField<Data, Payload>, "trailingIconClick">`,
where `IField<Data, Payload>` is a generic type representing a field with
`Data` and `Payload` types.

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

Gets the value of the "readonly" property from the provided object.

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

### leadingIconTabIndex

```ts
leadingIconTabIndex: number
```

### trailingIconTabIndex

```ts
trailingIconTabIndex: number
```
