# ITypographyFieldProps

Interface for props of the TypographyField component.

## Properties

### placeholder

```ts
placeholder: string
```

Retrieves the `placeholder` property from the given `IField` object.
The `placeholder` property is a key of type `PickProp`.

### typoVariant

```ts
typoVariant: "h2" | "h3" | "h4" | "h5" | "h6" | "subtitle1" | "subtitle2" | "body1" | "body2"
```

### className

```ts
className: string
```

Gets the value of the className property from the provided object.

This function uses the PickProp type from the IField interface to pick the 'className' property
from the provided object based on the Data and Payload generic types.

### style

```ts
style: CSSProperties
```

Retrieves the 'style' property of the given variable, using the 'PickProp' utility type.

### groupRef

```ts
groupRef: (element?: HTMLDivElement) => void
```
