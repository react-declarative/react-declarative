# IScaffold2Option

Interface representing an option for an IScaffold2 component.

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

Represents an array of `IScaffold2Tab` objects.

### options

```ts
options: IScaffold2Option<T>[]
```

Represents an array of options for a variable.

### isVisible

```ts
isVisible: (payload: T) => boolean | Promise<boolean>
```

Determines the visibility of a given payload.

### isDisabled

```ts
isDisabled: (payload: T) => boolean | Promise<boolean>
```

Checks if a payload is disabled.
