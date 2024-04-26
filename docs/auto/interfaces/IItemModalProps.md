# IItemModalProps

## Properties

### type

```ts
type: FieldType
```

### onValueChange

```ts
onValueChange: (v: any, config?: { skipReadonly?: boolean; }) => void
```

### value

```ts
value: any
```

### data

```ts
data: any
```

### payload

```ts
payload: any
```

### title

```ts
title: string
```

### placeholder

```ts
placeholder: string
```

### tip

```ts
tip: string[] | ((value: string, data: any, payload: any) => string[] | Promise<string[]>)
```

### tr

```ts
tr: ((s: string, data: any, payload: any) => string) | ((s: string, data: any, payload: any) => Promise<string>)
```

### keepRaw

```ts
keepRaw: boolean
```

### itemList

```ts
itemList: string[] | ((data: any, payload: any) => string[]) | ((data: any, payload: any) => Promise<string[]>)
```
