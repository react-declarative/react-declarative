# IBreadcrumbs2Option

Represents an option configuration for IBreadcrumbs2 component.

## Properties

### type

```ts
type: Breadcrumbs2Type
```

### label

```ts
label: ReactNode
```

### element

```ts
element: ComponentType<{ payload: Data; disabled: boolean; }>
```

### sx

```ts
sx: SxProps<any>
```

### outlined

```ts
outlined: boolean
```

### actions

```ts
actions: IBreadcrumbs2Action<Data>[]
```

### buttonVariant

```ts
buttonVariant: "text" | "outlined" | "contained"
```

### buttonColor

```ts
buttonColor: "inherit" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
```

### compute

```ts
compute: (payload: Data) => string | Promise<string>
```

### isVisible

```ts
isVisible: (payload: Data) => boolean | Promise<boolean>
```

### isDisabled

```ts
isDisabled: (payload: Data) => boolean | Promise<boolean>
```
