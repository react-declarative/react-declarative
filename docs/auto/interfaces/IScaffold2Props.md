# IScaffold2Props

## Properties

### noOptionHover

```ts
noOptionHover: boolean
```

### noContent

```ts
noContent: boolean
```

### noAppName

```ts
noAppName: boolean
```

### fixedHeader

```ts
fixedHeader: boolean
```

### noSearch

```ts
noSearch: boolean
```

### dense

```ts
dense: boolean
```

### className

```ts
className: string
```

### style

```ts
style: CSSProperties
```

### sx

```ts
sx: SxProps<any>
```

### appName

```ts
appName: string
```

### options

```ts
options: IScaffold2Group<T>[]
```

### actions

```ts
actions: IScaffold2Action<T>[]
```

### loading

```ts
loading: number | boolean
```

### payload

```ts
payload: T
```

### deps

```ts
deps: any[]
```

### activeOptionPath

```ts
activeOptionPath: string
```

### activeTabPath

```ts
activeTabPath: string
```

### AfterAppName

```ts
AfterAppName: ComponentType<any>
```

### BeforeActionMenu

```ts
BeforeActionMenu: ComponentType<any>
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

### BeforeContent

```ts
BeforeContent: ComponentType<any>
```

### AfterContent

```ts
AfterContent: ComponentType<any>
```

### Copyright

```ts
Copyright: ComponentType<any>
```

### onAction

```ts
onAction: (name: string) => void
```

### onOptionClick

```ts
onOptionClick: (path: string, id: string) => void
```

### onOptionGroupClick

```ts
onOptionGroupClick: (path: string, id: string) => void
```

### onTabChange

```ts
onTabChange: (path: string, tab: string, id: string) => void
```

### children

```ts
children: ReactNode
```

### onInit

```ts
onInit: () => void | Promise<void>
```

### onLoadStart

```ts
onLoadStart: () => void
```

### onLoadEnd

```ts
onLoadEnd: (isOk: boolean) => void
```

### fallback

```ts
fallback: (e: Error) => void
```

### throwError

```ts
throwError: boolean
```
