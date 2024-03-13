# IMasterDetailOption

Represents a configuration option for a master-detail component.

## Properties

### id

```ts
id: string
```

### icon

```ts
icon: React.ComponentType<any>
```

### label

```ts
label: string
```

### isVisible

```ts
isVisible: (payload: Payload) => boolean | Promise<boolean>
```

### isDisabled

```ts
isDisabled: (payload: Payload) => boolean | Promise<boolean>
```

### isActive

```ts
isActive: (payload: Payload) => boolean | Promise<boolean>
```
