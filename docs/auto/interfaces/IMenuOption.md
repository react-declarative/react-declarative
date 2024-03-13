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

### isDisabled

```ts
isDisabled: ((payload: T) => boolean) | ((payload: T) => Promise<boolean>)
```

### isVisible

```ts
isVisible: ((payload: T) => boolean) | ((payload: T) => Promise<boolean>)
```
