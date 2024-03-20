# IComboFieldProps

Represents the properties for the ComboField component.

## Properties

### description

```ts
description: string
```

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

### tr

```ts
tr: ((s: string, data: Data, payload: Payload) => string) | ((s: string, data: Data, payload: Payload) => Promise<string>)
```

### groupRef

```ts
groupRef: (element?: HTMLDivElement) => void
```
