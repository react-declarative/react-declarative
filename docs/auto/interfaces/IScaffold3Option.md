# IScaffold3Option

Interface representing an option for an IScaffold3 component.

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

### iconColor

```ts
iconColor: string
```

### tabs

```ts
tabs: IScaffold3Tab<T>[]
```

Represents an array of `IScaffold3Tab` objects.

### options

```ts
options: IScaffold3Option<T>[]
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
