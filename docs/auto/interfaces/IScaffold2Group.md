# IScaffold2Group

Interface representing a group in IScaffold2.

## Properties

### id

```ts
id: string
```

### label

```ts
label: string
```

### icon

```ts
icon: React.ComponentType
```

### iconColor

```ts
iconColor: string
```

### noHeader

```ts
noHeader: boolean
```

### isVisible

```ts
isVisible: () => boolean | Promise<boolean>
```

Checks if the element is visible.

### isDisabled

```ts
isDisabled: () => boolean | Promise<boolean>
```

Checks if the element is disabled.

### children

```ts
children: IScaffold2Option<T>[]
```
