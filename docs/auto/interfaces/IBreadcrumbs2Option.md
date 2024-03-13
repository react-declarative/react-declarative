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
