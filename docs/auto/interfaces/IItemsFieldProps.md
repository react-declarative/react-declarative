# IItemsFieldProps

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

### groupRef

```ts
groupRef: (element?: HTMLDivElement) => void
```

### labelShrink

```ts
labelShrink: boolean
```

### watchItemList

```ts
watchItemList: boolean
```
