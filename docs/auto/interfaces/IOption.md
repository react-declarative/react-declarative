# IOption

Represents an option for a specific action or behavior.

## Properties

### label

```ts
label: string
```

### action

```ts
action: string
```

### divider

```ts
divider: boolean
```

### primary

```ts
primary: number | boolean
```

### icon

```ts
icon: ComponentType<any>
```

### isVisible

```ts
isVisible: (payload: Payload) => boolean | Promise<boolean>
```

Checks the visibility of a given payload.

### isDisabled

```ts
isDisabled: (payload: Payload) => boolean | Promise<boolean>
```

Checks if the provided payload indicates that the element is disabled.
