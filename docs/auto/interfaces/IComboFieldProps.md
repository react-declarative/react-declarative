# IComboFieldProps

Represents the properties for the ComboField component.

## Properties

### description

```ts
description: string
```

Retrieves the "description" property

### placeholder

```ts
placeholder: string
```

### outlined

```ts
outlined: boolean
```

### itemList

```ts
itemList: string[] | ((data: Data, payload: Payload) => string[]) | ((data: Data, payload: Payload) => Promise<string[]>)
```

### freeSolo

```ts
freeSolo: boolean
```

### noDeselect

```ts
noDeselect: boolean
```

Specifies whether the field should allow deselection.

### virtualListBox

```ts
virtualListBox: boolean
```

### watchItemList

```ts
watchItemList: boolean
```

### readonly

```ts
readonly: boolean
```

Retrieves the "readonly" property from a given object of type IField&lt;Data, Payload&gt;.

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

Retrieves the "title" property for a field

### tr

```ts
tr: ((s: string, data: Data, payload: Payload) => string) | ((s: string, data: Data, payload: Payload) => Promise<string>)
```

### groupRef

```ts
groupRef: (element?: HTMLDivElement) => void
```
