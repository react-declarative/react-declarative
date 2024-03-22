# IMenuOption

Represents a menu option.

## Properties

### name

```ts
name: string
```

### label

```ts
label: string
```

### icon

```ts
icon: ComponentType<any>
```

### lifted

```ts
lifted: boolean
```

### roles

```ts
roles: string[]
```

### bold

```ts
bold: boolean
```

### visible

```ts
visible: boolean
```

### disabled

```ts
disabled: boolean
```

### getRoles

```ts
getRoles: ((payload: T) => string[]) | ((payload: T) => Promise<string[]>)
```

### isBold

```ts
isBold: ((payload: T) => boolean) | ((payload: T) => Promise<boolean>)
```

Determines whether the payload is in bold format.

### isDisabled

```ts
isDisabled: ((payload: T) => boolean) | ((payload: T) => Promise<boolean>)
```

Determines if the payload is disabled.

### isVisible

```ts
isVisible: ((payload: T) => boolean) | ((payload: T) => Promise<boolean>)
```

Determines the visibility of a payload based on specified conditions.
