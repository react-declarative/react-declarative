# IScaffoldProps

The interface for the Scaffold component props.

## Properties

### children

```ts
children: ReactNode
```

### className

```ts
className: string
```

### dense

```ts
dense: boolean
```

### withPassthrough

```ts
withPassthrough: boolean
```

### style

```ts
style: CSSProperties
```

### title

```ts
title: string
```

### loadingLine

```ts
loadingLine: boolean
```

### loading

```ts
loading: number
```

### colored

```ts
colored: boolean
```

### selected

```ts
selected: string
```

### options

```ts
options: IMenuGroup<any>[]
```

### actions

```ts
actions: IScaffoldOption<T>[]
```

### payload

```ts
payload: T
```

### throwError

```ts
throwError: boolean
```

### fallback

```ts
fallback: (e: Error) => void
```

### BeforeSearch

```ts
BeforeSearch: ComponentType<any>
```

### AfterSearch

```ts
AfterSearch: ComponentType<any>
```

### BeforeMenuContent

```ts
BeforeMenuContent: ComponentType<any>
```

### AfterMenuContent

```ts
AfterMenuContent: ComponentType<any>
```

### Loader

```ts
Loader: ComponentType<any>
```

### roles

```ts
roles: string[] | ((payload: T) => string[]) | ((payload: T) => Promise<string[]>)
```

### onOptionClick

```ts
onOptionClick: (name: string) => void
```

### onAction

```ts
onAction: (name: string) => void
```

### onInit

```ts
onInit: () => void | Promise<void>
```
