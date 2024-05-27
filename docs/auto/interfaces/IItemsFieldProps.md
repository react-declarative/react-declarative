# IItemsFieldProps

Props for the IItemsField component.

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

Returns the "description" property of the given object if it exists, otherwise returns undefined.

### placeholder

```ts
placeholder: string
```

Type definition for the `placeholder` property.

### outlined

```ts
outlined: boolean
```

Picks the specified property "outlined" from the given object type "IField&lt;Data, Payload&gt;".

### itemList

```ts
itemList: string[] | ((data: Data, payload: Payload) => string[]) | ((data: Data, payload: Payload) => Promise<string[]>)
```

### freeSolo

```ts
freeSolo: boolean
```

### virtualListBox

```ts
virtualListBox: boolean
```

### readonly

```ts
readonly: boolean
```

### disabled

```ts
disabled: boolean
```

### noDeselect

```ts
noDeselect: boolean
```

### title

```ts
title: string
```

### tr

```ts
tr: ((s: string, data: Data, payload: Payload) => string) | ((s: string, data: Data, payload: Payload) => Promise<string>)
```

Represents the "tr" property of a field in the given data and payload.

### groupRef

```ts
groupRef: (element?: HTMLDivElement) => void
```

Retrieves the value of the 'groupRef' property from the given object 'fieldData'.

### labelShrink

```ts
labelShrink: boolean
```

### watchItemList

```ts
watchItemList: boolean
```
