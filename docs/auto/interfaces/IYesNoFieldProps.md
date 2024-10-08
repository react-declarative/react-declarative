# IYesNoFieldProps

Interface representing the props for the YesNoField component.

## Properties

### validation

```ts
validation: IValidation
```

Validation factory config

### description

```ts
description: string
```

Picks the "description" property from a given object of type IField&lt;Data, Payload&gt;.

### placeholder

```ts
placeholder: string
```

Retrieves the "placeholder" property of the provided PickProp type, which is a property value of type string.

### outlined

```ts
outlined: boolean
```

Type declaration for the `outlined` property of the `PickProp` utility.
This utility allows you to pick a specific property from a given type and create a new type with only that property.
Type declaration for the `outlined` property of the `PickProp` utility.
This utility allows you to pick a specific property from a given type and create a new type with only that property.

### noDeselect

```ts
noDeselect: boolean
```

### virtualListBox

```ts
virtualListBox: boolean
```

### tr

```ts
tr: ((s: string, data: Data, payload: Payload) => string) | ((s: string, data: Data, payload: Payload) => Promise<string>)
```

### readonly

```ts
readonly: boolean
```

Represents the 'readonly' property of an object, extracted using the 'PickProp' utility type.

### disabled

```ts
disabled: boolean
```

### labelShrink

```ts
labelShrink: boolean
```

### title

```ts
title: string
```

Returns the value of the "title" property from an object of type IField&lt;Data, Payload&gt;.

### groupRef

```ts
groupRef: (element?: HTMLDivElement) => void
```
