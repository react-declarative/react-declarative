# IScaffold2Option

## Properties

### id

```ts
id: string
```

### label

```ts
label: string
```

### lifted

```ts
lifted: boolean
```

### pin

```ts
pin: boolean
```

### sx

```ts
sx: SxProps<any>
```

### icon

```ts
icon: ComponentType<any>
```

### tabs

```ts
tabs: IScaffold2Tab<T>[]
```

### options

```ts
options: IScaffold2Option<T>[]
```

### isVisible

```ts
isVisible: (payload: T) => boolean | Promise<boolean>
```

### isDisabled

```ts
isDisabled: (payload: T) => boolean | Promise<boolean>
```
