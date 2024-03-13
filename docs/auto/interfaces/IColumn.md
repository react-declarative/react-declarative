# IColumn

## Properties

### field

```ts
field: keyof T
```

### label

```ts
label: string
```

### align

```ts
align: "left" | "right" | "center" | "stretch"
```

### format

```ts
format: (row: T) => string | ReactElement<any, string | JSXElementConstructor<any>>
```

### minWidth

```ts
minWidth: number
```

### width

```ts
width: Dimension | ((containerWidth: number) => Dimension)
```
