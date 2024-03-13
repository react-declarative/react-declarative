# IOutlet

Represents an outlet that can be used to render content in a specific location in a React application.

## Properties

### id

```ts
id: string
```

### element

```ts
element: (props: IOutletProps<Data, Payload, Params> & OtherProps) => ReactElement<any, string | JSXElementConstructor<any>>
```

### isAvailable

```ts
isAvailable: (pathname: string) => boolean
```

### isActive

```ts
isActive: (pathname: string) => boolean
```
