# IDictFieldProps

Props for the IDictField component.

## Properties

### validation

```ts
validation: IValidation
```

Validation factory config

### dictLimit

```ts
dictLimit: number
```

Represents the 'dictLimit' property of an object.

### dictDelay

```ts
dictDelay: number
```

Retrieves the optional "dictDelay" property from the provided object.

### dictSearch

```ts
dictSearch: (dto: { search: string; limit: number; offset: number; initial: boolean; rows: ISearchItem<any>[]; data: Data; payload: Payload; }) => ISearchItem<any>[] | Promise<...>
```

### dictOnAppend

```ts
dictOnAppend: (search: string, data: Data, payload: Payload, onValueChange: (value: string) => void, onChange: (value: Data) => void) => void
```

Represents an optional configuration property for a dictionary append operation.

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

Retrieves the "dictValue" property from the given object.

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

Retrieves the value of the "dictCreateButton" property from the provided object,
which is of type PickProp&lt;IField&lt;Data, Payload&gt;, "dictCreateButton"&gt;.
Retrieves the value of the "dictCreateButton" property from the provided object,
which is of type PickProp&lt;IField<Data, Payload&gt;, "dictCreateButton">.

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

Retrieves the value of the "inputAutocomplete" property from the specified object.

### inputFormatter

```ts
inputFormatter: (input: string) => string
```

Represents an input formatter for a specific type of field in a form.

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

Type definition for the PickProp function.

### outlined

```ts
outlined: boolean
```

A type representing the picked property "outlined" from the given object type.

### title

```ts
title: string
```

Type declaration for the utility function `PickProp`.

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

Represents the `disabled` property of a given field in a form.

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

Represents the optional property 'leadingIconClick' from the 'IField' interface.

### trailingIconClick

```ts
trailingIconClick: (value: Value, data: Data, payload: Payload, onValueChange: (v: Value) => void, onChange: (data: Data) => void) => void
```

The `trailingIconClick` property defines the action to be performed when the trailing icon of a field is clicked.

### leadingIconTabIndex

```ts
leadingIconTabIndex: number
```

### trailingIconTabIndex

```ts
trailingIconTabIndex: number
```
