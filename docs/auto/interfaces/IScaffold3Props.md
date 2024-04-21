# IScaffold3Props

Represents the properties of the IScaffold3 component.

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
options: IScaffold3Group<T>[]
```

### actions

```ts
actions: IScaffold3Action<T>[]
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

Represents a React component type for the AfterSearch component.

### BeforeMenuContent

```ts
BeforeMenuContent: ComponentType<any>
```

Represents the type definition for the BeforeMenuContent variable.

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

The Copyright component is a React component that represents a copyright notice.
It can be used in a React application to display the copyright information.

### onAction

```ts
onAction: (name: string) => void
```

Represents a optional callback function that is triggered when an action is performed.
The function takes a `name` parameter of type `string` and returns `void`.

### onOptionClick

```ts
onOptionClick: (path: string, id: string) => boolean | void
```

Callback function that is triggered when an option is clicked.

### onOptionGroupClick

```ts
onOptionGroupClick: (path: string, id: string) => boolean | void
```

Function called when an option group is clicked.

### onTabChange

```ts
onTabChange: (path: string, tab: string, id: string) => void
```

Represents a callback for when a tab change event occurs.

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

Represents a function that acts as a fallback, which is executed when an error occurs.

### throwError

```ts
throwError: boolean
```
