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

Renders an element for the active outlet

### isAvailable

```ts
isAvailable: (pathname: string) => boolean
```

Checks if a given path is available.

### isActive

```ts
isActive: (pathname: string) => boolean
```

Determines if the given pathname is active.
